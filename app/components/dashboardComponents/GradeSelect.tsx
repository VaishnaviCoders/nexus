import {
  SelectTrigger,
  Select,
  SelectContent,
  SelectValue,
  SelectItem,
} from '@/components/ui/select';
import { useState } from 'react';

import useSWR from 'swr';
import { z } from 'zod';

const GradeSchema = z.object({
  id: z.string().cuid('Invalid grade ID'),
  grade: z.string().min(1, 'Grade name is required'),
});

type Grade = z.infer<typeof GradeSchema>;

interface GradeSelectProps {
  selectedGrade: (value: string) => void;
  defaultGrade: string;
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const GradeSelect: React.FC<GradeSelectProps> = ({
  selectedGrade,
  defaultGrade,
}) => {
  const { data: grades, error } = useSWR<Grade[]>('/api/grade', fetcher);

  const [validationError, setValidationError] = useState<string | null>(null);

  const handleSelect = (value: string) => {
    const parsedGrade = GradeSchema.safeParse(
      grades?.find((grade) => grade.id.toString() === value)
    );

    if (!parsedGrade.success) {
      setValidationError(parsedGrade.error.errors[0].message);
      return;
    }

    setValidationError(null); // Clear validation errors
    selectedGrade(value); // Proceed with the valid selection
  };

  if (error) {
    console.error('Failed to fetch grades:', error);
    return <div>Error loading grades.</div>;
  }

  return (
    <div>
      <Select onValueChange={handleSelect} defaultValue={defaultGrade}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select Grade" />
        </SelectTrigger>
        <SelectContent>
          {grades && grades.length > 0 ? (
            grades.map((item) => (
              <SelectItem key={item.id} value={item.id.toString()}>
                {item.grade}
              </SelectItem>
            ))
          ) : (
            <SelectItem value="not-found">Grade Not Found</SelectItem>
          )}
        </SelectContent>
      </Select>
      {validationError && (
        <span className="text-xs text-red-500 block my-4 h-2">
          {validationError}
        </span>
      )}
    </div>
  );
};

export default GradeSelect;
