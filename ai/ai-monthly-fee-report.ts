'use server';

export async function generateAISummaryOpenRouter(feeText: string) {
  const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

  console.log(
    'Generating AI summary using OpenRouter API...',
    feeText,
    'with key',
    OPENROUTER_API_KEY
  );

  const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${OPENROUTER_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'mistralai/mistral-7b-instruct:free',
      messages: [
        {
          role: 'system',
          content:
            'You are an expert school accountant. Summarize fee collections clearly.',
        },
        {
          role: 'user',
          content: `Summarize this school fee data:\n${feeText}`,
        },
      ],
    }),
  });

  const json = await res.json();

  console.log('OpenRouter API response:', json);

  console.log('Ai summary generated:', json.choices[0].message.content);
  return json.choices?.[0]?.message?.content ?? 'No summary generated.';
}

// 'use server';

// import { createOpenRouter } from '@openrouter/ai-sdk-provider';
// import { generateObject, generateText, streamText } from 'ai';
// import { z } from 'zod';

// // const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

// const openrouter = createOpenRouter({
//   apiKey: process.env.OPENROUTER_API_KEY!,
// });

// const AnalyticsSchema = z.object({
//   financialHealth: z.object({
//     score: z.number().min(0).max(100),
//     trend: z.enum(['up', 'down', 'stable']),
//     insights: z.array(z.string()).min(3).max(5),
//     predictions: z.array(z.string()).min(2).max(4),
//   }),
//   studentEngagement: z.object({
//     score: z.number().min(0).max(100),
//     riskStudents: z.number().min(0),
//     recommendations: z.array(z.string()).min(3).max(5),
//   }),
//   operationalEfficiency: z.object({
//     score: z.number().min(0).max(100),
//     bottlenecks: z.array(z.string()).min(1).max(4),
//     optimizations: z.array(z.string()).min(2).max(4),
//   }),
//   strategicInsights: z.object({
//     opportunities: z.array(z.string()).min(2).max(4),
//     threats: z.array(z.string()).min(1).max(3),
//     actionItems: z.array(z.string()).min(3).max(5),
//   }),
// });

// export async function generateAdvancedAnalytics() {
//   const { text } = await generateText({
//     model: openrouter.chat('anthropic/claude-3.5-sonnet'),
//     prompt: 'What is OpenRouter?',
//   });

//   console.log(text);
// }
