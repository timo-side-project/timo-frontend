import type { SentryEvent } from './types';

export interface ParsedFrame {
  filename: string;
  function: string;
  lineno: number;
  contextLine?: string;
}

export function parseStackTrace(event: SentryEvent): ParsedFrame[] {
  const frames = event.exception?.values?.[0]?.stacktrace?.frames ?? [];
  return frames
    .filter((frame) => frame.in_app && frame.filename)
    .reverse()
    .slice(0, 5)
    .map((frame) => ({
      filename: normalizeFilepath(frame.filename),
      function: frame.function,
      lineno: frame.lineno,
      contextLine: frame.context_line,
    }));
}

function normalizeFilepath(filepath: string): string {
  return filepath
    .replace(/^webpack:\/\/\/?/, '')
    .replace(/^app:\/\/\/?/, '')
    .replace(/^\/?\.\//, '')
    .replace(/^\//, '');
}
