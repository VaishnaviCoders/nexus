'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import { updateFeeCategory } from '@/lib/data/fee/fee-category-actions';
import { toast } from 'sonner';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

const feeCategorySchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters' }),
  description: z.string().optional(),
});

type FeeCategoryFormData = z.infer<typeof feeCategorySchema>;

interface EditFeeCategoryFormProps {
  category: {
    id: string;
    name: string;
    description: string | null;
  };
}

export function EditFeeCategoryForm({ category }: EditFeeCategoryFormProps) {
  const router = useRouter();

  const [isPending, startTransition] = useTransition();

  const form = useForm<FeeCategoryFormData>({
    resolver: zodResolver(feeCategorySchema),
    defaultValues: {
      name: category.name,
      description: category.description || '',
    },
  });

  async function onSubmit(data: FeeCategoryFormData) {
    startTransition(async () => {
      try {
        await updateFeeCategory(category.id, data);
        toast.success('Fee category updated successfully');
        router.push('/dashboard/fees/admin/fee-categories');
        router.refresh();
      } catch (error) {
        toast.error('Failed to create fee category');
      }
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="space-y-4">
          <div className="space-y-2">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Category Name" {...field} />
                  </FormControl>
                  <FormDescription>
                    This is your public Category Name.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="space-y-2">
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="Description" {...field} />
                  </FormControl>
                  <FormDescription>
                    This is your public Category Name.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <Button type="submit" className="w-full my-3" disabled={isPending}>
          {isPending ? 'Editing...' : 'Edit Fee Category'}
        </Button>
      </form>
    </Form>
  );
}
