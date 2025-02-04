import { ArrowLeft, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import prisma from '@/lib/db';
import { Separator } from '@/components/ui/separator';
import { AddSection } from '@/app/components/dashboardComponents/AddSection';
import { ScrollArea } from '@/components/ui/scroll-area';

async function getGradeWithSections(gradeId: string) {
  const grade = await prisma.grade.findUnique({
    where: { id: gradeId },
    include: {
      section: {
        include: {
          students: true,
        },
        orderBy: {
          name: 'asc',
        },
      },
    },
  });
  return grade;
}

export default async function GradePage({
  params,
}: {
  params: Promise<{ gradeId: string }>;
}) {
  const { gradeId } = await params;
  const grade = await getGradeWithSections(gradeId);

  if (!grade) {
    return <div>Grade not found</div>;
  }
  return (
    <div className="">
      <div className="flex items-center justify-between mb-4  ">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon">
            <Link href="/dashboard/grades">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>

          <div>
            <h1 className="text-xl font-bold">Grade : {grade.grade}</h1>
            <p className="text-muted-foreground text-sm">
              Sections for {grade.grade}
            </p>
          </div>
        </div>

        <AddSection gradeId={gradeId} />
      </div>
      <Separator />
      <ScrollArea className="h-min">
        <div className="flex flex-col items-center gap-4">
          {grade.section.map((section) => (
            <Card key={section.id} className="w-full my-2">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold">{section.name}</h2>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="icon">
                      <Link
                        href={`/dashboard/grades/${gradeId}/${section.id}/delete`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-muted-foreground">
                    Class Teacher: Teacher Name
                  </p>
                  <p className="text-muted-foreground">
                    {section.students.length} students
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
