'use server';

import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { generateText } from 'ai';

const google = createGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_GEMINI_AI,
});

const model = google('gemini-2.0-flash');

export async function generateAiMonthlyFeesReportAction(formattedText: string) {
  const prompt = `You are a data analyst. Analyze the following fee collection data and summarize it month-wise using the following structure:

-Instructions:
1. List each month as:
   1. Month collected ₹Amount from X payments
2. Then give:
   - Total amount collected
   - Total payments
   - Average payments/month

Here is the data:
${formattedText}`;

  const result = await generateText({ model, prompt });

  console.log('result ', result);

  return result.text;
}
