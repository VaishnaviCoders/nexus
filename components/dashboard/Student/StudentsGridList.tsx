import React, { Suspense } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { EmptyState } from '@/components/EmptyState';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Hash, Mail, Phone, User } from 'lucide-react';
import Loading from '@/app/dashboard/students/loading';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface Student {
  id: string;
  firstName: string;
  lastName: string;
  fullName?: string | null;
  rollNumber: string;
  phoneNumber: string;
  email: string;
  profileImage?: string | null;
  dateOfBirth: Date;
  grade: {
    id: string;
    grade: string;
  };
  section: {
    id: string;
    name: string;
  };
}

interface StudentsGridListProps {
  students: Student[];
}

const StudentsGridList = ({ students }: StudentsGridListProps) => {
  return (
    <>
      {students && students.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2  md:grid-cols-3 xl:grid-cols-4 gap-6">
          <Suspense fallback={<Loading />}>
            {students.map((student) => (
              <Link href={`/dashboard/students/${student.id}`} key={student.id}>
                <Card className="overflow-hidden transition-all hover:shadow-md">
                  <CardHeader className="p-0">
                    <div className="bg-muted h-12"></div>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <div className="flex flex-col items-center -mt-6 mb-4">
                      <Avatar className="h-16 w-16 border-4 border-background">
                        <AvatarImage
                          src={student.profileImage || ''}
                          alt={`${student.fullName} || ${student.firstName} ${student.lastName}`}
                        />
                        <AvatarFallback className="text-lg font-medium">
                          {`${student.firstName.charAt(
                            0
                          )}${student.lastName.charAt(0)}`}
                        </AvatarFallback>
                      </Avatar>
                      <h3 className="font-medium text-lg mt-2">{`${student.firstName}  ${student.lastName}`}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge
                          variant="outline"
                          className="text-xs font-normal"
                        >
                          {student.grade.grade}
                        </Badge>
                        {student.section && (
                          <Badge
                            variant="outline"
                            className="text-xs font-normal"
                          >
                            {student.section.name}
                          </Badge>
                        )}
                      </div>
                    </div>

                    <div className="space-y-3 text-sm">
                      <div className="flex items-center gap-2">
                        <Hash className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                        <span className="text-muted-foreground">
                          Roll Number:
                        </span>
                        <span className="font-medium">
                          {student.rollNumber}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                        <span className="truncate">{student.email}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                        <Button
                          // href={`tel:${student.phoneNumber}`}
                          variant={'ghost'}
                          className="text-blue-500 hover:text-blue-700"
                        >
                          {student.phoneNumber}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </Suspense>
        </div>
      ) : (
        <div className="flex justify-center items-center  my-5">
          <EmptyState
            title="No Students Found"
            description="No students found with the given search query."
            icons={[User, Mail, Phone]}
            image="/EmptyState.png"
            action={{
              label: 'Add New Student',
              href: '/dashboard/students/create',
            }}
          />
        </div>
      )}
    </>
  );
};

export default StudentsGridList;
