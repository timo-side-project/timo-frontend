interface CreateIssueParams {
  title: string;
  analysis: string;
  errorType: string;
  errorMessage: string;
  sentryUrl: string;
  frames: Array<{ filename: string; lineno: number; function: string }>;
}

export async function createGitHubIssue(
  params: CreateIssueParams,
): Promise<string> {
  const token = process.env.GITHUB_TOKEN;
  const owner = process.env.GITHUB_OWNER;
  const repo = process.env.GITHUB_REPO;

  if (!token || !owner || !repo)
    throw new Error('GitHub environment variables not configured');

  const stackSummary = params.frames
    .slice(0, 3)
    .map((f) => `- \`${f.filename}:${f.lineno}\` — \`${f.function}\``)
    .join('\n');

  const body = `## 🚨 Sentry 에러 자동 분석

> **에러**: ${params.errorType}: ${params.errorMessage}
> **Sentry**: ${params.sentryUrl}

### 발생 위치
${stackSummary || '정보 없음'}

---

${params.analysis}

---

*이 이슈는 Sentry Autofix(Gemini)에 의해 자동 생성되었습니다.*`;

  const response = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/issues`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/vnd.github.v3+json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: `[Sentry] ${params.title}`,
        body,
        labels: [],
      }),
    },
  );

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`GitHub API error: ${error}`);
  }

  const created = (await response.json()) as { html_url: string };
  return created.html_url;
}
