# Senior-Friendly Form Builder - Instructions

## Design Priority
Keep the interface SIMPLE and CLEAN - this will be used by elderly users.
- Large, readable text
- Clear labels
- Obvious buttons
- Minimal clutter

## Tech Stack
- Next.js 15 /16 
- Prisma (setup only, no backend implementation yet)
- shadcn/ui components
- shadcn Form components
- react-hook-form
- Zod validation
- Server Actions (structure only)
- useTransition for loading states
- Sonner for toast notifications
- No API Calls (prefer Server Actions)
- No Database (prefer Prisma)

## AI Integration (Optional)
Only use if necessary:
```typescript
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { generateText } from 'ai';
```

## Requirements
1. **Focus on Frontend First** - Create complete UI/UX, backend will be added later
2. **Clean Code Only** - No unnecessary code or comments
3. **Proper Form Structure**:
   - Full form validation with Zod
   - Loading states with useTransition
   - Success/error feedback with Sonner
   - Server Action structure (empty functions for now)
4. **Accessibility**:
   - High contrast
   - Large touch targets (minimum 44x44px)
   - Clear error messages
   - Keyboard navigation support

## Deliverables
- Complete form component with validation
- Server action file structure (empty functions)
- Prisma schema (no database connection needed yet)
- All necessary shadcn components properly configured

**Note**: Prioritize excellent visual design and alignment - make it look professional and polished.