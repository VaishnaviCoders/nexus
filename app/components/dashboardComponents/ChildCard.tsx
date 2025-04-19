import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card';
import { Calendar, Clock, GraduationCap, Hash, Phone } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import Image from 'next/image';

export interface ChildType {
  profileImage?: string | null;
  firstName: string;
  lastName: string;
  dateOfBirth: Date;
  phoneNumber?: string;
  rollNumber?: string;
  StudentAttendance?: Array<{
    id: string;
    date: string | Date;
    status: 'PRESENT' | 'ABSENT' | 'LATE';
  }>;
  section?: {
    name: string;
  };
  grade?: {
    grade: string;
  };
}

interface ChildCardProps {
  child: ChildType;
}

// export function AttendanceIndicator(rate: number) {
//   let color = 'bg-red-500';

//   if (rate >= 90) {
//     color = 'bg-green-500';
//   } else if (rate >= 75) {
//     color = 'bg-yellow-500';
//   } else if (rate >= 50) {
//     color = 'bg-orange-500';
//   }

//   return (
//     <div className="flex items-center gap-2">
//       <div className="h-2 w-16 bg-gray-200 rounded-full overflow-hidden">
//         <div
//           className={`h-full ${color} rounded-full`}
//           style={{ width: `${rate}%` }}
//         />
//       </div>
//       <span className="text-xs font-medium">{Math.round(rate)}%</span>
//     </div>
//   );
// }

export function ChildCard({ child }: ChildCardProps) {
  // const attendanceRate = calculateAttendanceRate(child.StudentAttendance);
  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <CardHeader className="p-0">
        <div className="relative h-48 w-full bg-gradient-to-b from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900">
          {child.profileImage ? (
            <Image
              src={child.profileImage || '/placeholder.svg'}
              alt={`${child.firstName} ${child.lastName}`}
              fill
              className="object-cover"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-6xl font-bold text-slate-300 dark:text-slate-700">
                {child.firstName.charAt(0)}
                {child.lastName.charAt(0)}
              </span>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <div className="flex flex-col gap-4">
          <div>
            <h3 className="text-xl font-bold">
              {child.firstName} {child.lastName}
            </h3>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant="outline" className="font-normal">
                {child.grade?.grade || 'No Grade'}
              </Badge>
              <Badge variant="outline" className="font-normal">
                {child.section?.name || 'No Section'}
              </Badge>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 text-sm">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span>
                {new Intl.DateTimeFormat('en-US').format(child.dateOfBirth)}
              </span>
            </div>

            {child.phoneNumber && (
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span>{child.phoneNumber}</span>
              </div>
            )}

            {child.rollNumber && (
              <div className="flex items-center gap-2">
                <Hash className="h-4 w-4 text-muted-foreground" />
                <span>Roll No: {child.rollNumber}</span>
              </div>
            )}

            <div className="flex items-center gap-2">
              <GraduationCap className="h-4 w-4 text-muted-foreground" />
              <span>
                {child.grade?.grade
                  ? `Grade ${child.grade.grade}${
                      child.section?.name ? ` - ${child.section.name}` : ''
                    }`
                  : 'No Grade Info'}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span>Attendance: </span>
              {/* <AttendanceIndicator rate={attendanceRate} /> */}
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-6 pt-0 flex justify-between">
        <Button variant="outline" size="sm">
          View Details
        </Button>
        <Button variant="secondary" size="sm">
          Contact
        </Button>
      </CardFooter>
    </Card>
  );
}

function calculateAttendanceRate(attendance: any[] | undefined): number {
  if (!attendance || attendance.length === 0) return 0;

  const present = attendance.filter((a) => a.status === 'PRESENT').length;
  return (present / attendance.length) * 100;
}
