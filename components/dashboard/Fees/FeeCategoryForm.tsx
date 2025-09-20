'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import { createFeeCategory } from '@/lib/data/fee/fee-category-actions';
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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { InfoIcon } from 'lucide-react';

const categorySchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters' }),
  description: z.string().optional(),
});

export function FeeCategoryForm() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof categorySchema>>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: '',
      description: '',
    },
  });

  async function onSubmit(data: z.infer<typeof categorySchema>) {
    startTransition(async () => {
      try {
        await createFeeCategory(data);
        form.reset();
        toast.success('Fee category created successfully');
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
                    <Input
                      placeholder="Category Name"
                      {...field}
                      className="capitalize"
                    />
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
                    <Input placeholder="Description" {...field} className="" />
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
          {isPending ? 'Creating...' : 'Create Fee Category'}
        </Button>
      </form>

      <Card className="mt-8 border-blue-200 bg-blue-50/50">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-primary mb-1 flex items-center gap-3">
                Hint <InfoIcon className="w-5 h-5 text-primary" />
              </h3>
              <p className="text-blue-700 text-sm">
                Each category helps you group related fees (like Tuition,
                Library, or Sports fees) for easier management.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </Form>
  );
}
