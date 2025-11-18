# Alternative: Using OpenAI (Better Function Calling Support)

If Google Gemini continues to have issues, you can switch to OpenAI which has excellent function calling support.

## Option 1: OpenAI GPT-4o-mini (Very Cheap - $0.15/$0.60 per million tokens)

1. Install OpenAI SDK:

```bash
npm install @ai-sdk/openai
```

2. Update the agent file:

```typescript
import { openai } from '@ai-sdk/openai';

export const feeSenseAgent = new Agent({
  model: openai('gpt-4o-mini'), // Very cheap, excellent function calling
  // ... rest of config
});
```

3. Set environment variable:

```env
OPENAI_API_KEY=your_key_here
```

## Option 2: OpenAI GPT-3.5-turbo (Cheaper but older)

```typescript
model: openai('gpt-3.5-turbo'),
```

## Option 3: Anthropic Claude (Free tier available)

1. Install:

```bash
npm install @ai-sdk/anthropic
```

2. Use:

```typescript
import { anthropic } from '@ai-sdk/anthropic';

export const feeSenseAgent = new Agent({
  model: anthropic('claude-3-5-sonnet-20241022'),
  // ... rest of config
});
```

## Free Options:

- **Google Gemini**: Free tier available, but function calling can be finicky
- **OpenAI**: $5 free credit to start, then pay-as-you-go (GPT-4o-mini is very cheap)
- **Anthropic**: Free tier with Claude API

## Recommendation:

**GPT-4o-mini** is the best balance of cost and function calling reliability. It's extremely cheap and has excellent tool/function calling support.
