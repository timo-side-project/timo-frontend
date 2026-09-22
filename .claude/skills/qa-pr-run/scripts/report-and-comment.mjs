#!/usr/bin/env node
// e2e/.generated/results.json(Playwright --reporter=json)을 읽어 실패를
// 프론트 버그 / API 에러 / 응답 스키마 불일치로 분류하고 마크다운 리포트를 만든다.
// AI 없이 순수 스크립트로 동작 — CI에서 커밋된 코드로 실행하기 위함(qa-pr-pipeline.md 3단계 참고).
//
// 사용:
//   node report-and-comment.mjs                 # 리포트를 stdout에 출력
//   node report-and-comment.mjs --comment <PR번호>  # PR 코멘트로 생성/갱신 (gh CLI, GH_TOKEN 필요)

import { execSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';

const RESULTS_PATH = 'e2e/.generated/results.json';
const CONTEXT_PATH = 'e2e/.generated/context.md';
const MARKER = '<!-- qa-pr-run-report -->';
const SCHEMA_KEYWORDS = ['zoderror', 'zod', 'schema', 'invalid_type', 'expected string', 'expected number'];

function decode(body) {
  if (!body) return '';
  try {
    return Buffer.from(body, 'base64').toString('utf8');
  } catch {
    return body;
  }
}

function attachmentText(attachments, name) {
  return decode(attachments?.find((a) => a.name === name)?.body ?? '');
}

function classify(consoleErrors, apiErrors, failureMessage) {
  const schemaHit = consoleErrors
    .split('\n')
    .some((line) => {
      const lower = line.toLowerCase();
      if (lower.includes('failed to load resource')) return false; // 브라우저 기본 네트워크 로그, 근거 아님
      return SCHEMA_KEYWORDS.some((k) => lower.includes(k));
    });
  if (schemaHit) return { category: '응답 스키마 불일치', evidence: consoleErrors.trim() };
  if (apiErrors.trim()) return { category: 'API 에러(참고용 — 의도적 모킹일 수 있음)', evidence: apiErrors.trim() };
  return { category: '프론트 버그', evidence: (failureMessage ?? '').split('\n').slice(0, 3).join(' ') };
}

function collectTests(suite, list) {
  for (const spec of suite.specs ?? []) {
    for (const test of spec.tests ?? []) {
      const result = test.results?.at(-1);
      if (!result) continue;
      list.push({
        title: spec.title,
        file: spec.file,
        status: result.status,
        attachments: result.attachments ?? [],
        error: result.error?.message ?? result.errors?.[0]?.message ?? '',
      });
    }
  }
  for (const sub of suite.suites ?? []) collectTests(sub, list);
}

function buildContextSection() {
  if (!existsSync(CONTEXT_PATH)) {
    return '(Claude가 context.md를 안 남김 — 매칭된 스펙이 없거나 워크플로 검증에 걸려 Phase 1~4 자체가 스킵됐을 수 있음)';
  }
  return readFileSync(CONTEXT_PATH, 'utf8').trim();
}

function buildReport() {
  const lines = [MARKER, '## QA 리포트 (qa-pr-run, 자동 생성)', '', buildContextSection(), ''];

  if (!existsSync(RESULTS_PATH)) {
    lines.push('## 실행 결과', '', `\`${RESULTS_PATH}\` 없음 — Phase 5(실행)가 돌지 않았거나 생성된 시나리오가 없음.`);
    lines.push('', '> 이 리포트는 머지 게이트가 아니다 — 사람이 직접 확인한다.');
    return lines.join('\n');
  }

  const data = JSON.parse(readFileSync(RESULTS_PATH, 'utf8'));
  const tests = [];
  for (const suite of data.suites ?? []) collectTests(suite, tests);

  const passed = tests.filter((t) => t.status === 'passed');
  const failed = tests.filter((t) => t.status !== 'passed');

  lines.push('## 실행 결과', '');
  lines.push(`총 ${tests.length}개 / 통과 ${passed.length}개 / 실패 ${failed.length}개`, '');

  if (failed.length === 0) {
    lines.push('실패 없음 — 생성된 시나리오는 전부 통과했다.');
  } else {
    lines.push('### 실패');
    failed.forEach((t, i) => {
      const consoleErrors = attachmentText(t.attachments, 'console-errors');
      const apiErrors = attachmentText(t.attachments, 'api-errors');
      const { category, evidence } = classify(consoleErrors, apiErrors, t.error);
      lines.push(
        `${i + 1}. **${t.title}** — **${category}**`,
        `   - 근거: ${evidence || '(근거 없음, results.json 직접 확인 필요)'}`,
        `   - 파일: \`${t.file}\``,
      );
    });
  }

  lines.push(
    '',
    '> 자동 분류는 참고용이다. `api-errors`는 시나리오가 의도적으로 모킹한 응답일 수 있어 "API 에러"로 단정하지 않는다.',
    '> 이 리포트는 머지 게이트가 아니다 — 사람이 직접 확인한다.',
  );
  return lines.join('\n');
}

function upsertComment(prNumber, body) {
  const repo = process.env.GITHUB_REPOSITORY;
  if (!repo) throw new Error('GITHUB_REPOSITORY 환경변수 없음 (CI 밖에서는 --comment 쓰지 않는다)');

  const bodyFile = 'e2e/.generated/comment-body.md';
  mkdirSync('e2e/.generated', { recursive: true }); // Claude가 시나리오를 하나도 못 만든 경우(스킵·매칭 없음) 디렉토리 자체가 없을 수 있다
  writeFileSync(bodyFile, body);

  const existing = execSync(
    `gh api repos/${repo}/issues/${prNumber}/comments --paginate --jq '.[] | select(.body | startswith("${MARKER}")) | .id' | head -n1`,
    { encoding: 'utf8' },
  ).trim();

  if (existing) {
    execSync(`gh api -X PATCH repos/${repo}/issues/comments/${existing} -f body=@${bodyFile}`, { stdio: 'inherit' });
  } else {
    execSync(`gh pr comment ${prNumber} --body-file ${bodyFile}`, { stdio: 'inherit' });
  }
}

const report = buildReport();
const commentFlagIndex = process.argv.indexOf('--comment');

if (commentFlagIndex !== -1) {
  const prNumber = process.argv[commentFlagIndex + 1];
  if (!prNumber) throw new Error('--comment 뒤에 PR 번호를 줘야 함');
  upsertComment(prNumber, report);
} else {
  console.log(report);
}
