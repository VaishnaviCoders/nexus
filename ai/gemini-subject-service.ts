import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { generateText } from 'ai';
import { Subject } from '@/generated/prisma';

const google = createGoogleGenerativeAI({
  apiKey:
    process.env.NEXT_PUBLIC_GOOGLE_GEMINI_AI ||
    process.env.GOOGLE_GENERATIVE_AI_API_KEY!,
});

export interface AISubjectSuggestion {
  correctedName?: string;
  description?: string;
  codeSuggestions: string[];
  similarSubjects: Array<{
    id: string;
    name: string;
    code: string;
    similarity: number;
  }>;
  hasSpellingError: boolean;
  confidence: number;
}

// Common subject name corrections and patterns
const COMMON_CORRECTIONS: Record<string, string> = {
  // Science variants
  scince: 'Science',
  scinece: 'Science',
  sciense: 'Science',
  sience: 'Science',

  // Mathematics variants
  mathematic: 'Mathematics',
  matematics: 'Mathematics',
  mathmatics: 'Mathematics',
  maths: 'Mathematics',

  // English variants
  englsih: 'English',
  engish: 'English',
  enlgish: 'English',

  // History variants
  histroy: 'History',
  histry: 'History',

  // Geography variants
  geograpy: 'Geography',
  geografy: 'Geography',

  // Physics variants
  phisics: 'Physics',
  fisics: 'Physics',
  physic: 'Physics',

  // Chemistry variants
  chemestry: 'Chemistry',
  chimistry: 'Chemistry',
  chemisty: 'Chemistry',

  // Biology variants
  biologi: 'Biology',
  biolgy: 'Biology',

  // Computer Science variants
  'computer sience': 'Computer Science',
  'computr science': 'Computer Science',
  'compter science': 'Computer Science',
};

/**
 * Calculate similarity between two strings using Levenshtein distance
 */
function calculateSimilarity(str1: string, str2: string): number {
  const s1 = str1.toLowerCase().trim();
  const s2 = str2.toLowerCase().trim();

  if (s1 === s2) return 1.0;

  const matrix = Array(s2.length + 1)
    .fill(null)
    .map(() => Array(s1.length + 1).fill(null));

  for (let i = 0; i <= s1.length; i++) matrix[0][i] = i;
  for (let j = 0; j <= s2.length; j++) matrix[j][0] = j;

  for (let j = 1; j <= s2.length; j++) {
    for (let i = 1; i <= s1.length; i++) {
      const indicator = s1[i - 1] === s2[j - 1] ? 0 : 1;
      matrix[j][i] = Math.min(
        matrix[j][i - 1] + 1,
        matrix[j - 1][i] + 1,
        matrix[j - 1][i - 1] + indicator
      );
    }
  }

  const maxLength = Math.max(s1.length, s2.length);
  return maxLength === 0
    ? 1.0
    : (maxLength - matrix[s2.length][s1.length]) / maxLength;
}

/**
 * Find similar subjects based on name similarity
 */
function findSimilarSubjects(
  inputName: string,
  existingSubjects: Subject[]
): Array<{
  id: string;
  name: string;
  code: string;
  similarity: number;
}> {
  if (!inputName.trim()) return [];

  const similarities = existingSubjects
    .map((subject) => ({
      id: subject.id,
      name: subject.name,
      code: subject.code,
      similarity: calculateSimilarity(inputName, subject.name),
    }))
    .filter((item) => item.similarity > 0.6) // Only show if similarity > 60%
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, 5); // Show top 5 similar subjects

  return similarities;
}

/**
 * Check for spelling corrections
 */
function getSpellingCorrection(input: string): {
  corrected: string;
  hasError: boolean;
} {
  const normalized = input.toLowerCase().trim();

  // Direct corrections
  if (COMMON_CORRECTIONS[normalized]) {
    return {
      corrected: COMMON_CORRECTIONS[normalized],
      hasError: true,
    };
  }

  // Check for partial matches
  for (const [error, correction] of Object.entries(COMMON_CORRECTIONS)) {
    if (normalized.includes(error) || error.includes(normalized)) {
      const similarity = calculateSimilarity(normalized, error);
      if (similarity > 0.7) {
        return {
          corrected: correction,
          hasError: true,
        };
      }
    }
  }

  return {
    corrected: input,
    hasError: false,
  };
}

/**
 * Generate subject code suggestions
 */
function generateCodeSuggestions(
  subjectName: string,
  existingSubjects: Subject[]
): string[] {
  if (!subjectName.trim()) return [];

  const existingCodes = new Set(
    existingSubjects.map((s) => s.code.toUpperCase())
  );
  const suggestions: string[] = [];

  const words = subjectName.trim().split(/\s+/);
  const firstWord = words[0];
  const secondWord = words[1];

  // Pattern 1: First 4 letters + numbers
  if (firstWord.length >= 3) {
    const base = firstWord.substring(0, 4).toUpperCase();
    for (let i = 101; i <= 999; i++) {
      const code = base + i;
      if (!existingCodes.has(code) && suggestions.length < 3) {
        suggestions.push(code);
      }
    }
  }

  // Pattern 2: First 3 letters + numbers
  if (firstWord.length >= 3) {
    const base = firstWord.substring(0, 3).toUpperCase();
    for (let i = 101; i <= 999; i++) {
      const code = base + i;
      if (!existingCodes.has(code) && suggestions.length < 5) {
        suggestions.push(code);
      }
    }
  }

  // Pattern 3: Acronym + numbers (for multi-word subjects)
  if (words.length > 1) {
    const acronym = words
      .map((w) => w.charAt(0))
      .join('')
      .toUpperCase();
    for (let i = 101; i <= 999; i++) {
      const code = acronym + i;
      if (!existingCodes.has(code) && suggestions.length < 7) {
        suggestions.push(code);
      }
    }
  }

  // Pattern 4: Common subject prefixes
  const commonPrefixes: Record<string, string> = {
    mathematics: 'MATH',
    math: 'MATH',
    english: 'ENG',
    science: 'SCI',
    physics: 'PHYS',
    chemistry: 'CHEM',
    biology: 'BIO',
    history: 'HIST',
    geography: 'GEO',
    computer: 'CS',
    programming: 'PROG',
    literature: 'LIT',
    philosophy: 'PHIL',
    psychology: 'PSYC',
    sociology: 'SOC',
    economics: 'ECON',
    business: 'BUS',
    management: 'MGMT',
  };

  for (const [key, prefix] of Object.entries(commonPrefixes)) {
    if (firstWord.toLowerCase().includes(key)) {
      for (let i = 101; i <= 999; i++) {
        const code = prefix + i;
        if (!existingCodes.has(code) && suggestions.length < 10) {
          suggestions.push(code);
        }
      }
      break;
    }
  }

  return [...new Set(suggestions)].slice(0, 6);
}

/**
 * Generate AI-powered subject description
 */
async function generateAIDescription(subjectName: string): Promise<string> {
  if (!subjectName.trim()) return '';

  try {
    const prompt = `Generate a concise, educational description (max 150 characters) for the academic subject "${subjectName}". 
    Focus on:
    - What the subject covers
    - Key topics or areas of study
    - Learning objectives
    - Practical applications
    
    Keep it professional and suitable for an educational institution. Return only the description without any prefix or introduction.`;

    const result = await generateText({
      model: google('gemini-1.5-flash'),
      prompt,
      maxTokens: 200,
      temperature: 0.7,
    });

    return result.text.trim();
  } catch (error) {
    console.error('Error generating AI description:', error);

    // Fallback descriptions for common subjects
    const fallbackDescriptions: Record<string, string> = {
      mathematics:
        'Study of numbers, structures, space, and change. Covers arithmetic, algebra, geometry, calculus, and statistics to develop logical reasoning and problem-solving skills.',
      english:
        'Language arts subject focusing on literature, writing, grammar, and communication skills. Develops reading comprehension, critical analysis, and effective expression.',
      science:
        'Systematic study of the natural world through observation and experimentation. Introduces scientific method and fundamental principles across various disciplines.',
      physics:
        'Study of matter, energy, and their interactions. Covers mechanics, thermodynamics, electromagnetism, and modern physics concepts.',
      chemistry:
        'Study of matter, its properties, composition, and chemical reactions. Explores atomic structure, bonding, and molecular behavior.',
      biology:
        'Study of living organisms and life processes. Covers cell structure, genetics, evolution, ecology, and human biology.',
      history:
        'Study of past events, civilizations, and their impact on the present. Develops understanding of historical patterns and critical thinking skills.',
      geography:
        "Study of Earth's physical features, climate, and human settlements. Explores spatial relationships and environmental interactions.",
    };

    const key = subjectName.toLowerCase();
    for (const [subject, description] of Object.entries(fallbackDescriptions)) {
      if (key.includes(subject)) {
        return description;
      }
    }

    return `Comprehensive study of ${subjectName} covering fundamental concepts, practical applications, and critical thinking skills essential for academic and professional development.`;
  }
}

/**
 * Main AI suggestion function
 */
export async function getAISubjectSuggestions(
  inputName: string,
  existingSubjects: Subject[]
): Promise<AISubjectSuggestion> {
  try {
    // Get spelling correction
    const spellCheck = getSpellingCorrection(inputName);

    // Use corrected name for further processing
    const processName = spellCheck.corrected;

    // Find similar subjects
    const similarSubjects = findSimilarSubjects(inputName, existingSubjects);

    // Generate code suggestions
    const codeSuggestions = generateCodeSuggestions(
      processName,
      existingSubjects
    );

    // Generate AI description
    const description = await generateAIDescription(processName);

    // Calculate confidence score
    let confidence = 0.8;
    if (spellCheck.hasError) confidence += 0.1;
    if (codeSuggestions.length > 0) confidence += 0.05;
    if (description.length > 50) confidence += 0.05;

    return {
      correctedName: spellCheck.hasError ? spellCheck.corrected : undefined,
      description: description || undefined,
      codeSuggestions,
      similarSubjects,
      hasSpellingError: spellCheck.hasError,
      confidence: Math.min(confidence, 1.0),
    };
  } catch (error) {
    console.error('Error getting AI suggestions:', error);

    // Return basic suggestions even if AI fails
    const spellCheck = getSpellingCorrection(inputName);
    const codeSuggestions = generateCodeSuggestions(
      spellCheck.corrected,
      existingSubjects
    );
    const similarSubjects = findSimilarSubjects(inputName, existingSubjects);

    return {
      correctedName: spellCheck.hasError ? spellCheck.corrected : undefined,
      codeSuggestions,
      similarSubjects,
      hasSpellingError: spellCheck.hasError,
      confidence: 0.6,
    };
  }
}

/**
 * Debounced version for real-time suggestions
 */
export function createDebouncedSuggestions(delay: number = 500) {
  let timeoutId: NodeJS.Timeout;

  return (
    inputName: string,
    existingSubjects: Subject[]
  ): Promise<AISubjectSuggestion> => {
    return new Promise((resolve) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(async () => {
        const suggestions = await getAISubjectSuggestions(
          inputName,
          existingSubjects
        );
        resolve(suggestions);
      }, delay);
    });
  };
}
