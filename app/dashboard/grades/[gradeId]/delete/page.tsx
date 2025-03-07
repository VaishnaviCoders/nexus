import { deleteGrade } from '@/app/actions';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { DeleteGradeButton } from '@/lib/SubmitButton';
import Link from 'next/link';
import { use } from 'react';

export default function DeleteGradePage({
  params,
}: {
  params: Promise<{ gradeId: string }>;
}) {
  const { gradeId } = use(params);

  // const handleDelete = async () => {
  //   'use server';

  //   const formData = new FormData();
  //   formData.append('gradeId', gradeId);
  //   await deleteGrade(formData);
  // };
  return (
    <div className=" flex justify-center items-center w-full">
      <Card className="max-w-xl">
        <CardHeader>
          <CardTitle>Are you absolutely sure?</CardTitle>
          <CardDescription>
            This action cannot be undone. This will permanently delete this
            <strong className="text-red-500"> Grade </strong> and all its data,
            including{' '}
            <strong className="text-red-500">Sections and Students</strong>.
          </CardDescription>
        </CardHeader>
        <CardFooter className="justify-end flex gap-3 items-center">
          <Link href="/dashboard/grades">
            <Button variant="outline" type="button">
              Cancel
            </Button>
          </Link>
          <form action={deleteGrade}>
            <input type="hidden" name="gradeId" value={gradeId} />
            <DeleteGradeButton />
          </form>
        </CardFooter>
      </Card>
    </div>
  );
}
