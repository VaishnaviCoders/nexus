import useSWR from 'swr';
import {
  SelectTrigger,
  Select,
  SelectContent,
  SelectValue,
  SelectItem,
} from '@/components/ui/select';
import { z } from 'zod';
import { useState } from 'react';

const SectionSchema = z.object({
  id: z.string().cuid('Invalid section ID'),
  name: z.string().min(1, 'Section name is required'),
});

type Section = z.infer<typeof SectionSchema>;

interface SectionSelectProps {
  selectedGradeId: string;
  onSelectSection: (value: string) => void;
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const SectionSelect: React.FC<SectionSelectProps> = ({
  selectedGradeId,
  onSelectSection,
}) => {
  const { data: sections, error } = useSWR<Section[]>(
    selectedGradeId ? `/api/section/${selectedGradeId}` : null,
    fetcher
  );

  const [validationError, setValidationError] = useState<string | null>(null);

  const handleSectionSelect = (value: string) => {
    const parsedSection = SectionSchema.safeParse(
      sections?.find((section) => section.id === value)
    );

    if (!parsedSection.success) {
      setValidationError(parsedSection.error.errors[0].message);
      return;
    }

    setValidationError(null); // Clear validation errors
    onSelectSection(value); // Proceed with the valid selection
  };

  if (!selectedGradeId) {
    return null;
  }

  if (error) {
    console.error('Error fetching sections:', error);
    return <p>Error</p>;
  }

  return (
    <div>
      <Select onValueChange={handleSectionSelect}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select Section" />
        </SelectTrigger>
        <SelectContent>
          {sections && sections.length > 0 ? (
            sections.map((section) => (
              <SelectItem key={section.id} value={section.id}>
                {section.name}
              </SelectItem>
            ))
          ) : (
            <SelectItem value="not-found">No Sections Found</SelectItem>
          )}
        </SelectContent>
      </Select>
      {validationError && (
        <span className="text-xs text-red-500 block mt-2">
          {validationError}
        </span>
      )}
    </div>
  );
};

export default SectionSelect;
