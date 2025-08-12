import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { generateText } from 'ai';

export type AISubjectSuggestion = {
  correctedName?: string;
  description?: string;
  codeSuggestions: string[];
  confidence: number;
};

export type AICSVAnalysis = {
  normalizedRows: Array<{
    originalName: string;
    normalizedName: string;
    suggestedCode: string;
    confidence: number;
  }>;
  duplicateGroups: Array<{
    items: string[];
    suggestedMerge: string;
    confidence: number;
  }>;
  recommendations: string[];
};

export class GeminiAIService {
  private static instance: GeminiAIService;
  private google: ReturnType<typeof createGoogleGenerativeAI> | null = null;
  private model: any = null;

  private constructor() {
    const apiKey = process.env.GOOGLE_GEMINI_AI;
    if (apiKey) {
      this.google = createGoogleGenerativeAI({
        apiKey: apiKey,
      });
      this.model = this.google('gemini-1.5-flash');
    }
  }

  static getInstance(): GeminiAIService {
    if (!GeminiAIService.instance) {
      GeminiAIService.instance = new GeminiAIService();
    }
    return GeminiAIService.instance;
  }

  isAvailable(): boolean {
    return !!this.model;
  }

  async analyzeSubjectName(
    name: string,
    existingSubjects: string[] = []
  ): Promise<AISubjectSuggestion> {
    if (!this.isAvailable()) {
      return this.getMockSubjectSuggestion(name);
    }

    try {
      const prompt = `You are an educational AI assistant helping with academic subject management.

Analyze the subject name "${name}" and provide suggestions in the following JSON format:

{
  "correctedName": "corrected name if there are typos, otherwise null",
  "description": "a concise 1-2 sentence academic description",
  "codeSuggestions": ["CODE1", "CODE2", "CODE3"],
  "confidence": 0.85
}

Guidelines:
- Only suggest correctedName if there are clear spelling errors
- Description should be academic and professional
- Code suggestions should be 2-6 characters, uppercase, relevant to the subject
- Consider these existing subjects to avoid duplicates: ${existingSubjects.join(', ')}
- Confidence should be between 0.1 and 1.0

Respond with ONLY the JSON object, no additional text.`;

      const { text } = await generateText({
        model: this.model,
        prompt,
        temperature: 0.3,
        maxTokens: 500,
      });

      try {
        const cleanedText = text.replace(/```json\n?|\n?```/g, '').trim();
        const parsed = JSON.parse(cleanedText);

        return {
          correctedName: parsed.correctedName || undefined,
          description:
            parsed.description ||
            `Academic subject focusing on ${name.toLowerCase()} concepts and principles.`,
          codeSuggestions: Array.isArray(parsed.codeSuggestions)
            ? parsed.codeSuggestions.slice(0, 3)
            : this.generateCodeSuggestions(name),
          confidence:
            typeof parsed.confidence === 'number'
              ? Math.min(Math.max(parsed.confidence, 0.1), 1.0)
              : 0.7,
        };
      } catch (parseError) {
        console.warn(
          'Failed to parse AI response, using fallback:',
          parseError
        );
        return this.getMockSubjectSuggestion(name);
      }
    } catch (error) {
      console.error('Error calling Gemini API:', error);
      return this.getMockSubjectSuggestion(name);
    }
  }

  async analyzeCSVData(
    csvRows: Array<{ name: string; code: string }>
  ): Promise<AICSVAnalysis> {
    if (!this.isAvailable()) {
      return this.getMockCSVAnalysis(csvRows);
    }

    try {
      // Limit data size for API efficiency
      const limitedRows = csvRows.slice(0, 50);

      const prompt = `You are an educational AI assistant analyzing CSV data for academic subjects.

Analyze this CSV data: ${JSON.stringify(limitedRows)}

Provide analysis in this JSON format:
{
  "normalizedRows": [
    {
      "originalName": "original name",
      "normalizedName": "properly capitalized name",
      "suggestedCode": "SUGGESTED_CODE",
      "confidence": 0.85
    }
  ],
  "duplicateGroups": [
    {
      "items": ["similar name 1", "similar name 2"],
      "suggestedMerge": "best name to use",
      "confidence": 0.9
    }
  ],
  "recommendations": ["recommendation 1", "recommendation 2"]
}

Guidelines:
- Normalize names with proper capitalization
- Detect fuzzy duplicates (similar names like "Math" vs "Mathematics")
- Suggest appropriate subject codes (2-6 characters, uppercase)
- Provide actionable recommendations for data quality

Respond with ONLY the JSON object.`;

      const { text } = await generateText({
        model: this.model,
        prompt,
        temperature: 0.2,
        maxTokens: 2000,
      });

      try {
        const cleanedText = text.replace(/```json\n?|\n?```/g, '').trim();
        const parsed = JSON.parse(cleanedText);

        return {
          normalizedRows: Array.isArray(parsed.normalizedRows)
            ? parsed.normalizedRows
            : [],
          duplicateGroups: Array.isArray(parsed.duplicateGroups)
            ? parsed.duplicateGroups
            : [],
          recommendations: Array.isArray(parsed.recommendations)
            ? parsed.recommendations
            : ['Review all entries before importing'],
        };
      } catch (parseError) {
        console.warn(
          'Failed to parse CSV analysis, using fallback:',
          parseError
        );
        return this.getMockCSVAnalysis(csvRows);
      }
    } catch (error) {
      console.error('Error calling Gemini API for CSV analysis:', error);
      return this.getMockCSVAnalysis(csvRows);
    }
  }
  private getMockCSVAnalysis(
    csvRows: Array<{ name: string; code: string }>
  ): AICSVAnalysis {
    const normalizedRows = csvRows.map((row) => ({
      originalName: row.name,
      normalizedName: this.normalizeSubjectName(row.name),
      suggestedCode: row.code || this.generateCodeSuggestions(row.name)[0],
      confidence: 0.8,
    }));

    const duplicateGroups = this.findDuplicateGroups(
      normalizedRows.map((r) => r.normalizedName)
    );

    const recommendations = [
      'Consider standardizing subject name formats across your institution',
      'Review and resolve duplicate entries before importing to avoid conflicts',
      "Verify generated codes match your institution's coding standards",
      'Ensure all required fields are properly filled',
    ];

    return {
      normalizedRows,
      duplicateGroups,
      recommendations,
    };
  }

  private getMockSubjectSuggestion(name: string): AISubjectSuggestion {
    const commonTypos: Record<string, string> = {
      mathmatics: 'Mathematics',
      phisics: 'Physics',
      chemestry: 'Chemistry',
      biologey: 'Biology',
      englsh: 'English',
      histroy: 'History',
      geographey: 'Geography',
      literture: 'Literature',
      psycology: 'Psychology',
      philosphy: 'Philosophy',
    };

    const correctedName = commonTypos[name.toLowerCase()] || undefined;

    const descriptions: Record<string, string> = {
      mathematics:
        'Study of numbers, shapes, patterns, and logical reasoning through problem-solving techniques.',
      physics:
        'Science exploring matter, energy, motion, and the fundamental forces governing the universe.',
      chemistry:
        'Science examining the composition, structure, properties, and reactions of matter.',
      biology:
        'Study of living organisms, their structure, function, growth, evolution, and interactions.',
      english:
        'Study of language, literature, writing, and communication skills in the English language.',
      history:
        'Study of past events, civilizations, and their impact on human development and society.',
      geography:
        "Study of Earth's physical features, climate, and human-environment interactions.",
      literature:
        'Study of written works, their themes, styles, and cultural significance.',
      psychology:
        'Science of mind and behavior, exploring cognitive processes and human development.',
      philosophy:
        'Study of fundamental questions about existence, knowledge, values, and reasoning.',
    };

    const nameToAnalyze = (correctedName || name).toLowerCase();
    const description =
      descriptions[nameToAnalyze] ||
      `Academic subject focusing on ${nameToAnalyze} concepts, principles, and practical applications.`;

    return {
      correctedName,
      description,
      codeSuggestions: this.generateCodeSuggestions(correctedName || name),
      confidence: correctedName ? 0.9 : 0.7,
    };
  }

  private normalizeSubjectName(name: string): string {
    return name
      .toLowerCase()
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
      .trim();
  }

  private generateCodeSuggestions(name: string): string[] {
    const words = name.split(' ').filter((word) => word.length > 0);
    const suggestions: string[] = [];

    // Acronym from first letters
    if (words.length > 0) {
      suggestions.push(
        words.map((word) => word.charAt(0).toUpperCase()).join('')
      );
    }

    // First word truncated
    if (words[0]) {
      suggestions.push(words[0].substring(0, 4).toUpperCase());
    }

    // Combination approach
    if (words.length > 1) {
      suggestions.push(
        words[0].substring(0, 3).toUpperCase() +
          words[1].charAt(0).toUpperCase()
      );
    } else if (words[0]) {
      suggestions.push(words[0].substring(0, 5).toUpperCase());
    }

    return suggestions
      .filter((s) => s.length >= 2 && s.length <= 6)
      .filter((s, index, arr) => arr.indexOf(s) === index) // Remove duplicates
      .slice(0, 3);
  }

  private findDuplicateGroups(
    names: string[]
  ): Array<{ items: string[]; suggestedMerge: string; confidence: number }> {
    const groups: Array<{
      items: string[];
      suggestedMerge: string;
      confidence: number;
    }> = [];
    const processed = new Set<string>();

    for (let i = 0; i < names.length; i++) {
      if (processed.has(names[i])) continue;

      const similar = [names[i]];
      for (let j = i + 1; j < names.length; j++) {
        if (this.calculateSimilarity(names[i], names[j]) > 0.7) {
          similar.push(names[j]);
          processed.add(names[j]);
        }
      }

      if (similar.length > 1) {
        // Choose the longest name as the suggested merge
        const suggestedMerge = similar.reduce((longest, current) =>
          current.length > longest.length ? current : longest
        );

        groups.push({
          items: similar,
          suggestedMerge,
          confidence: 0.8,
        });
      }

      processed.add(names[i]);
    }

    return groups;
  }

  private calculateSimilarity(str1: string, str2: string): number {
    const longer = str1.length > str2.length ? str1 : str2;
    const shorter = str1.length > str2.length ? str2 : str1;

    if (longer.length === 0) return 1.0;

    const editDistance = this.levenshteinDistance(
      longer.toLowerCase(),
      shorter.toLowerCase()
    );
    return (longer.length - editDistance) / longer.length;
  }

  private levenshteinDistance(str1: string, str2: string): number {
    const matrix: number[][] = [];

    for (let i = 0; i <= str2.length; i++) {
      matrix[i] = [i];
    }

    for (let j = 0; j <= str1.length; j++) {
      matrix[0][j] = j;
    }

    for (let i = 1; i <= str2.length; i++) {
      for (let j = 1; j <= str1.length; j++) {
        if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1, // substitution
            matrix[i][j - 1] + 1, // insertion
            matrix[i - 1][j] + 1 // deletion
          );
        }
      }
    }

    return matrix[str2.length][str1.length];
  }
}

export const geminiAI = GeminiAIService.getInstance();
