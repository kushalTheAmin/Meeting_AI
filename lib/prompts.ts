/**
 * AI prompt templates for different summary types
 */

export const SUMMARY_TEMPLATES = {
  meeting: `Analyze this meeting transcript and provide a structured summary.

Transcript:
{transcript}

Please provide the following in a clear, organized format:

1. **Summary**: A brief 2-3 sentence overview of the meeting
2. **Key Discussion Points**: List the main topics discussed (bullet points)
3. **Action Items**: List any tasks or follow-ups mentioned with responsible parties if available
4. **Decisions Made**: List any decisions that were made during the meeting
5. **Next Steps**: List upcoming actions or follow-up meetings

Format your response with clear headers and bullet points.`,

  interview: `Analyze this interview transcript and provide a structured summary.

Transcript:
{transcript}

Please provide the following in a clear, organized format:

1. **Interview Summary**: Brief overview of the interview (2-3 sentences)
2. **Questions Asked**: List the main questions that were asked
3. **Key Responses & Insights**: Summarize the most important answers and insights
4. **Strengths Observed**: Notable strengths or positive aspects mentioned
5. **Areas of Concern**: Any concerns or areas that need clarification
6. **Follow-up Questions**: Suggested questions for future discussion

Format your response with clear headers and bullet points.`,

  lecture: `Analyze this lecture transcript and provide a structured summary.

Transcript:
{transcript}

Please provide the following in a clear, organized format:

1. **Main Topic Overview**: Brief description of the lecture's main subject (2-3 sentences)
2. **Key Concepts Explained**: List and briefly explain the main concepts covered
3. **Important Examples/Case Studies**: Note any examples or case studies mentioned
4. **Key Takeaways**: List the most important points to remember
5. **Suggested Review Topics**: Topics that might need further study or review

Format your response with clear headers and bullet points.`,

  memo: `Analyze this voice memo and provide a concise summary.

Transcript:
{transcript}

Please provide the following:

1. **Quick Summary**: 1-2 sentence overview
2. **Category/Topic**: What category does this memo fall under?
3. **Main Points**: List the key points mentioned (bullet points)
4. **Action Items**: Any tasks or reminders (if applicable)

Keep the response concise and well-organized.`
} as const;

export type TemplateKey = keyof typeof SUMMARY_TEMPLATES;

/**
 * Get the formatted prompt for a given template and transcript
 */
export function getSummaryPrompt(template: TemplateKey, transcript: string): string {
  return SUMMARY_TEMPLATES[template].replace('{transcript}', transcript);
}

/**
 * Get display names for templates
 */
export const TEMPLATE_DISPLAY_NAMES: Record<TemplateKey, string> = {
  meeting: 'Meeting Notes',
  interview: 'Interview Notes',
  lecture: 'Lecture Notes',
  memo: 'Voice Memo',
};

/**
 * Get template descriptions
 */
export const TEMPLATE_DESCRIPTIONS: Record<TemplateKey, string> = {
  meeting: 'Extract key points, action items, and decisions from meetings',
  interview: 'Summarize questions, responses, and insights from interviews',
  lecture: 'Identify main concepts, examples, and takeaways from lectures',
  memo: 'Quick summary and categorization of voice memos',
};
