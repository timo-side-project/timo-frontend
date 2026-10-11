#!/usr/bin/env node
// e2e/.generated/results.json(Playwright --reporter=json)을 읽어 실패를
// 프론트 버그 / API 에러 / 응답 스키마 불일치 / 확인 필요로 분류하고 마크다운 리포트를 만든다.
// AI 없이 순수 스크립트로 동작 — CI에서 커밋된 코드로 실행하기 위함(qa-pr-pipeline.md 3단계 참고).
//
// 사용:
//   node report-and-comment.mjs                 # 리포트를 stdout에 출력
//   node report-and-comment.mjs --comment <PR번호>  # PR 코멘트로 생성/갱신 (gh CLI, GH_TOKEN 필요)

import { execSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';

const RESULTS_PATH = 'e2e/.generated/results.json';
const CONTEXT_PATH = 'e2e/.generated/context.md';
const PR_INFO_PATH = 'e2e/.generated/pr.json';
const RUN_OUTCOME_PATH = 'e2e/.generated/run-outcome.txt';
const MARKER = '<!-- qa-pr-run-report -->';
const SCHEMA_KEYWORDS = ['zoderror', 'zod', 'schema', 'invalid_type', 'expected string', 'expected number'];

// eslint-disable-next-line no-control-regex
const ANSI_CODES = /\x1b\[[0-9;]*m/g;

function stripAnsi(text) {
  return text.replace(ANSI_CODES, '');
}

function decode(body) {
  if (!body) return '';
  try {
    return stripAnsi(Buffer.from(body, 'base64').toString('utf8'));
  } catch {
    return stripAnsi(body);
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

  const message = stripAnsi(failureMessage ?? '');
  const evidence = message.split('\n').slice(0, 3).join(' ');

  // 셀렉터를 못 찾거나 타임아웃이면 생성 테스트가 잘못 짚었을 가능성이 크다 — 버그로 단정하지 않는다
  const lower = message.toLowerCase();
  const selectorMiss = lower.includes('tobevisible') || lower.includes('timeout');
  const hasExpectedReceived = lower.includes('expected') && lower.includes('received');
  if (selectorMiss && !hasExpectedReceived) {
    return { category: '확인 필요(테스트 품질 의심)', evidence };
  }

  return { category: '프론트 버그', evidence };
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

// mergeable은 push 직후 UNKNOWN일 수 있어 CONFLICTING일 때만 알린다
function buildConflictWarning() {
  if (!existsSync(PR_INFO_PATH)) return [];
  try {
    const { mergeable } = JSON.parse(readFileSync(PR_INFO_PATH, 'utf8'));
    if (mergeable !== 'CONFLICTING') return [];
  } catch {
    return [];
  }
  return ['> ⚠️ **main과 충돌 중** — 아래 결과는 충돌 해결 전 코드 기준이다. 리베이스 후 다시 확인이 필요하다.', ''];
}

// 워크플로가 Playwright 스텝의 outcome을 적어 둔다 (테스트 0개 + 실패 구분용)
function readRunOutcome() {
  if (!existsSync(RUN_OUTCOME_PATH)) return '';
  try {
    return readFileSync(RUN_OUTCOME_PATH, 'utf8').trim();
  } catch {
    return '';
  }
}

function buildReport() {
  const lines = [
    MARKER,
    '## QA 리포트 (qa-pr-run, 자동 생성)',
    '',
    ...buildConflictWarning(),
    buildContextSection(),
    '',
  ];

  if (!existsSync(RESULTS_PATH)) {
    lines.push('## 실행 결과', '', `\`${RESULTS_PATH}\` 없음 — Phase 5(실행)가 돌지 않았거나 생성된 시나리오가 없음.`);
    lines.push('', '> 이 리포트는 머지 게이트가 아니다 — 사람이 직접 확인한다.');
    return lines.join('\n');
  }

  const data = JSON.parse(readFileSync(RESULTS_PATH, 'utf8'));
  const tests = [];
  for (const suite of data.suites ?? []) collectTests(suite, tests);

  const passed = tests.filter((t) => t.status === 'passed');
  // test.fixme/skip은 "사람 확인 필요"로 남긴 것이라 실패가 아니다
  const skipped = tests.filter((t) => t.status === 'skipped');
  const failed = tests.filter((t) => t.status !== 'passed' && t.status !== 'skipped');

  lines.push('## 실행 결과', '');
  lines.push(
    `총 ${tests.length}개 / 통과 ${passed.length}개 / 실패 ${failed.length}개 / 사람 확인 필요 ${skipped.length}개`,
    '',
  );

  if (skipped.length) {
    lines.push('### 사람 확인 필요 (자동 검증 대상 아님)');
    skipped.forEach((t) => lines.push(`- ${t.title}`));
    lines.push('');
  }

  if (readRunOutcome() === 'failure') {
    lines.push('Playwright 실행이 실패로 끝났다(exit code != 0). 실패한 시나리오가 없다면 실행 자체가 안 된 것이다.', '');
  }

  if (tests.length === 0) {
    // Playwright가 spec 파일을 하나도 못 찾은 경우 — "전부 통과"로 읽히면 안 된다
    lines.push(
      '**생성된 시나리오 없음** — Claude가 Phase 4에서 Playwright 파일을 만들지 않았을 수 있다. 위 "생성한 시나리오" 목록은 실행되지 않았다.',
    );
  } else if (failed.length === 0) {
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
    execSync(`gh api -X PATCH repos/${repo}/issues/comments/${existing} -F body=@${bodyFile}`, { stdio: 'inherit' });
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
