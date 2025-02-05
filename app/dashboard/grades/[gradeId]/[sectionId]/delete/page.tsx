'use client';

import { deleteSection } from '@/app/actions';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { DeleteSectionButton } from '@/lib/SubmitButton';
import Link from 'next/link';
import { use } from 'react';

export default function SectionDeleteRoute({
  params,
}: {
  params: Promise<{ sectionId: string }>;
}) {
  // Unwrap the params promise
  const { sectionId } = use(params);

  // const handleDelete = async () => {
  //   const formData = new FormData();
  //   formData.append('sectionId', sectionId);
  //   await deleteSection(formData);
  // };

  return (
    <div className="flex justify-center items-center w-full p-4">
      <Card className="w-full max-w-xl">
        <CardHeader>
          <CardTitle>Are you absolutely sure?</CardTitle>
          <CardDescription>
            This action cannot be undone. This will permanently delete this{' '}
            <strong className="text-destructive"> Grade </strong> and all its
            data, including{' '}
            <strong className="text-destructive">Sections and Students</strong>.
          </CardDescription>
        </CardHeader>
        <CardFooter className="justify-end flex gap-3 items-center">
          <Link href="/dashboard/grades">
            <Button variant="outline" type="button">
              Cancel
            </Button>
          </Link>
          <form action={deleteSection}>
            <input type="hidden" name="sectionId" value={sectionId} />
            <DeleteSectionButton />
          </form>
        </CardFooter>
      </Card>
    </div>
  );
}
