#!/usr/bin/env node
// PR diff와 docs/product/*.md의 frontmatter `sources` glob을 결정적으로 매칭한다.
// 사용: node match-spec-docs.mjs [baseRef]
// 항상 exit 0으로 종료한다 (diff 대상이 없거나 base ref가 없어도 스킬 흐름을 막지 않기 위함).

import { execSync } from 'node:child_process';
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const repoRoot = execSync('git rev-parse --show-toplevel', { encoding: 'utf8' }).trim();
const productDocsDir = join(repoRoot, 'docs', 'product');

const GLOBAL_PATTERNS = [
  'src/components/ui/**',
  'src/components/layout/**',
  'src/hooks/**',
  'src/lib/**',
  'src/styles/**',
  'src/types/**',
  'app/layout.tsx',
  'app/providers.tsx',
  'app/global-error.tsx',
  'next.config.ts',
  'package.json',
  'middleware.ts',
  'proxy.ts',
];

// 런타임 동작과 무관해 QA 시나리오 대상이 아닌 파일 — spec/global 매칭보다 우선한다.
const NOT_FOR_QA_PATTERNS = [
  'docs/**',
  '.claude/**',
  '.github/**',
  'e2e/**',
  '**/*.stories.tsx',
  'public/**',
];

function globToRegExp(glob) {
  const parts = glob.split('/');
  let re = '';
  parts.forEach((part, i) => {
    const isLast = i === parts.length - 1;
    if (part === '**') {
      re += isLast ? '.*' : '(?:.*/)?';
      return;
    }
    const escaped = part.replace(/[.+^${}()|[\]\\]/g, '\\$&').replace(/\*/g, '[^/]*');
    re += escaped;
    if (!isLast) re += '/';
  });
  return new RegExp(`^${re}$`);
}

function getChangedFiles(baseRef) {
  const candidates = baseRef ? [baseRef] : ['origin/main', 'main'];
  for (const ref of candidates) {
    try {
      const out = execSync(`git diff --name-only --diff-filter=ACMR ${ref}...HEAD`, {
        encoding: 'utf8',
        cwd: repoRoot,
      });
      return { baseRef: ref, files: out.split('\n').filter(Boolean) };
    } catch {
      // try next candidate
    }
  }
  return { baseRef: null, files: [], error: 'diff 대상 base ref를 찾지 못함 (origin/main, main 모두 실패)' };
}

function parseSources(mdPath) {
  const text = readFileSync(mdPath, 'utf8');
  const fmMatch = text.match(/^---\n([\s\S]*?)\n---/);
  if (!fmMatch) return [];
  const fm = fmMatch[1];
  const sourcesMatch = fm.match(/sources:\n((?:\s+- .+\n?)+)/);
  if (!sourcesMatch) return [];
  return sourcesMatch[1]
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.startsWith('- '))
    .map((line) => line.slice(2).trim());
}

function loadDocs() {
  return readdirSync(productDocsDir)
    .filter((f) => f.endsWith('.md'))
    .map((f) => {
      const relPath = `docs/product/${f}`;
      return { doc: relPath, sources: parseSources(join(productDocsDir, f)).map(globToRegExp) };
    });
}

const baseArg = process.argv[2];
const { baseRef, files, error } = getChangedFiles(baseArg);
const docs = loadDocs();
const globalRegexes = GLOBAL_PATTERNS.map(globToRegExp);
const notForQaRegexes = NOT_FOR_QA_PATTERNS.map(globToRegExp);

const matchedDocs = new Map();
const globalFiles = [];
const notForQaFiles = [];
const noSpecFiles = [];

for (const file of files) {
  // QA 대상 아님(docs/.claude/e2e/stories/public 등)이 최우선 — 기능 폴더 안에 있어도 런타임 동작이 아니므로 노이즈를 줄인다.
  if (notForQaRegexes.some((re) => re.test(file))) {
    notForQaFiles.push(file);
    continue;
  }
  const hitDocs = docs.filter(({ sources }) => sources.some((re) => re.test(file)));
  if (hitDocs.length > 0) {
    for (const { doc } of hitDocs) {
      if (!matchedDocs.has(doc)) matchedDocs.set(doc, []);
      matchedDocs.get(doc).push(file);
    }
    continue;
  }
  if (globalRegexes.some((re) => re.test(file))) {
    globalFiles.push(file);
    continue;
  }
  noSpecFiles.push(file);
}

const result = {
  baseRef,
  error,
  changedFiles: files,
  matchedDocs: [...matchedDocs.entries()].map(([doc, matchedFiles]) => ({ doc, matchedFiles })),
  globalFiles,
  notForQaFiles,
  noSpecFiles,
};

console.log(JSON.stringify(result, null, 2));
