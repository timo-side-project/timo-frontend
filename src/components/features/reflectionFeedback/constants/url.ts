export const REFLECTION_FEEDBACK_ENDPOINTS = {
  createFeedback: (id: number) => `/reflections/${id}/feedback`,
  feedbackDetail: (id: number) => `/reflections/${id}/feedback`,
} as const;
