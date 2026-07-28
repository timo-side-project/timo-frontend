export const reflectionFeedbackKeys = {
  all: ['reflectionFeedback'] as const,
  create: () => [...reflectionFeedbackKeys.all, 'create'] as const,
  detail: (id: number) =>
    [...reflectionFeedbackKeys.all, 'detail', id] as const,
};
