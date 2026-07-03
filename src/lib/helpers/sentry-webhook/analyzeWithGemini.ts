import { GoogleGenerativeAI } from '@google/generative-ai';

import type { ParsedFrame } from './parseStackTrace';

interface AnalysisInput {
  errorType: string;
  errorMessage: string;
  frames: ParsedFrame[];
  codeFiles: Array<{ filename: string; content: string; lineno: number }>;
  sentryIssueUrl: string;
}

export async function analyzeWithGemini(input: AnalysisInput): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error('GEMINI_API_KEY not configured');
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: 'gemini-3.1-flash-lite' });

  const codeContext = input.codeFiles
    .map(
      (f) =>
        `### ${f.filename} (error at line ${f.lineno})\n\`\`\`typescript\n${f.content}\n\`\`\``,
    )
    .join('\n\n');

  const stackTrace = input.frames
    .map((f) => `  at ${f.function} (${f.filename}:${f.lineno})`)
    .join('\n');

  const prompt = `당신은 시니어 Next.js/TypeScript 개발자입니다. 아래 에러를 분석하고 해결 방법을 제안해주세요.

## 에러 정보
- **타입**: ${input.errorType}
- **메시지**: ${input.errorMessage}
- **Sentry URL**: ${input.sentryIssueUrl}

## 스택 트레이스
\`\`\`
${stackTrace}
\`\`\`

## 관련 코드
${codeContext || '코드를 가져올 수 없었습니다.'}

## 요청
다음 형식으로 분석 결과를 작성해주세요 (마크다운):

### 🔍 에러 원인 분석
(에러가 발생한 근본 원인 설명)

### 💡 해결 방법
(구체적인 해결 방법 1-3가지)

### 🔧 수정 코드 예시
(수정된 코드 스니펫)

### ⚠️ 재발 방지 제안
(같은 에러 재발을 막기 위한 제안)`;

  const result = await model.generateContent(prompt);
  return result.response.text();
}
