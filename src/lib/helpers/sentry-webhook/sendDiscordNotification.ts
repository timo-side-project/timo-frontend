interface DiscordNotifyParams {
  title: string;
  errorType: string;
  errorMessage: string;
  sentryUrl: string;
  githubIssueUrl: string;
}

export async function sendDiscordNotification(
  params: DiscordNotifyParams,
): Promise<void> {
  const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
  if (!webhookUrl) return;

  const embed = {
    title: `🚨 ${params.title}`,
    color: 0xed4245,
    fields: [
      { name: 'Error', value: `${params.errorType}: ${params.errorMessage}` },
      { name: 'GitHub Issue', value: params.githubIssueUrl },
      { name: 'Sentry', value: params.sentryUrl },
    ],
  };

  const response = await fetch(webhookUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ embeds: [embed] }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Discord webhook error: ${error}`);
  }
}
