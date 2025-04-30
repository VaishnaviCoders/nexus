'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus } from 'lucide-react';
import { useForm } from '@conform-to/react';
import { parseWithZod } from '@conform-to/zod';
import { sectionSchema } from '@/lib/schemas';
import { createSection } from '@/app/actions';
import { CreateSectionButton } from '@/lib/SubmitButton';
import { useActionState } from 'react';

interface AddSectionProps {
  gradeId: string;
}

export function AddSection({ gradeId }: AddSectionProps) {
  const [lastResult, action] = useActionState(createSection, undefined);
  const [form, fields] = useForm({
    lastResult,
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: sectionSchema });
    },
    shouldValidate: 'onBlur',
    shouldRevalidate: 'onInput',
  });

  console.log('GradeId:', gradeId);
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Create Section
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create Grade for gradeId </DialogTitle>
          <DialogDescription>
            Create a new grade for your school.
          </DialogDescription>
        </DialogHeader>
        <form action={action} id={form.id} onSubmit={form.onSubmit}>
          <input type="hidden" name="gradeId" value={gradeId} />

          <div className="grid  items-center gap-4">
            <Label htmlFor="sectionName" className="text-left">
              Section Name
            </Label>
            <Input
              id="sectionName"
              placeholder="Enter section name"
              name={fields.name.name}
              defaultValue={fields.name.initialValue}
              key={fields.name.key}
              className="col-span-3"
            />
          </div>
          <span className="text-xs text-red-500 block my-4 h-2">
            {fields.name.errors}
          </span>

          <CreateSectionButton />
        </form>
      </DialogContent>
    </Dialog>
  );
}
