export interface SentryStackFrame {
  filename: string;
  function: string;
  lineno: number;
  colno: number;
  in_app: boolean;
  context_line?: string;
  pre_context?: string[];
  post_context?: string[];
  abs_path?: string;
}

export interface SentryException {
  type: string;
  value: string;
  stacktrace?: { frames: SentryStackFrame[] };
}

export interface SentryEvent {
  event_id: string;
  message?: string;
  exception?: { values: SentryException[] };
  tags?: [string, string][];
  platform?: string;
  url?: string;
  level?: string;
  culprit?: string;
}

export interface SentryIssue {
  id: string;
  shortId: string;
  title: string;
  culprit?: string;
  permalink: string;
  project?: { name: string; slug: string };
  level?: string;
  status?: string;
}

export interface SentryWebhookPayload {
  action: string;
  data: { event?: SentryEvent; issue?: SentryIssue };
  installation?: { uuid: string };
}
