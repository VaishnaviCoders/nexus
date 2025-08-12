'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  MoreHorizontal,
  Search,
  Trash2,
  CheckCircle,
  Clock,
  Pause,
} from 'lucide-react';
import type { AssignmentStatus } from '@/generated/prisma';
import { AddTeachingAssignmentForm } from './AddTeachingAssignmentForm';
import {
  deleteTeachingAssignment,
  updateTeachingAssignmentStatus,
} from '@/lib/data/teaching-assignment/createTeachingAssignment';
import { toast } from 'sonner';
// import { updateAssignmentStatus, deleteTeachingAssignment } from "@/app/actions/teaching-assignments"

interface TeachingAssignment {
  id: string;
  status: AssignmentStatus;
  academicYear: string | null;
  createdAt: Date;
  updatedAt: Date;
  teacher: {
    id: string;
    user: {
      firstName: string;
      lastName: string;
      email: string;
      profileImage: string;
    };
    employeeCode: string | null;
  };
  subject: {
    id: string;
    name: string;
    code: string;
  };
  grade: {
    id: string;
    grade: string;
  };
  section: {
    id: string;
    name: string;
  };
  AcademicYear: {
    id: string;
    name: string;
  } | null;
}

interface FormDataProps {
  teachers: Array<{
    id: string;
    user: {
      firstName: string;
      lastName: string;
      email: string;
    };
    employeeCode: string | null;
  }>;
  subjects: Array<{
    id: string;
    name: string;
    code: string;
  }>;
  grades: Array<{
    id: string;
    grade: string;
    section: Array<{
      id: string;
      name: string;
    }>;
  }>;
  academicYears: Array<{
    id: string;
    name: string;
    isCurrent: boolean;
  }>;
}

interface TeachingAssignmentsTableProps {
  assignments: TeachingAssignment[];
  formData: FormDataProps;
}

const statusConfig = {
  PENDING: {
    color:
      'bg-yellow-100 text-yellow-800 hover:text-yellow-900 hover:bg-yellow-200 cursor-pointer',
    icon: Clock,
    label: 'Pending',
  },
  ASSIGNED: {
    color:
      'bg-green-100 text-green-800 hover:text-green-900 hover:bg-green-200 cursor-pointer',
    icon: CheckCircle,
    label: 'Assigned',
  },
  COMPLETED: {
    color:
      'bg-blue-100 text-blue-800  hover:text-blue-900 hover:bg-blue-200 cursor-pointer',
    icon: CheckCircle,
    label: 'Completed',
  },
  INACTIVE: {
    color:
      'bg-gray-100 text-gray-800  hover:text-gray-900 hover:bg-gray-200 cursor-pointer',
    icon: Pause,
    label: 'Inactive',
  },
};

const TeachingAssignmentsTable = ({
  assignments,
  formData,
}: TeachingAssignmentsTableProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [gradeFilter, setGradeFilter] = useState('all');
  const [subjectFilter, setSubjectFilter] = useState('all');
  const [selectedAssignment, setSelectedAssignment] =
    useState<TeachingAssignment | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const filteredAssignments = assignments.filter((assignment) => {
    const matchesSearch =
      assignment.teacher.user.firstName
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      assignment.teacher.user.lastName
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      assignment.subject.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      assignment.subject.code
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      assignment.grade.grade.toLowerCase().includes(searchTerm.toLowerCase()) ||
      assignment.section.name.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === 'all' || assignment.status === statusFilter;
    const matchesGrade =
      gradeFilter === 'all' || assignment.grade.id === gradeFilter;
    const matchesSubject =
      subjectFilter === 'all' || assignment.subject.id === subjectFilter;

    return matchesSearch && matchesStatus && matchesGrade && matchesSubject;
  });

  const handleStatusChange = async (
    assignmentId: string,
    newStatus: AssignmentStatus
  ) => {
    try {
      const result = await updateTeachingAssignmentStatus(
        assignmentId,
        newStatus
      );
      if (result.success) {
        toast.success('Assignment status updated successfully.');
      } else {
        toast.error(result.error);
      }
    } catch (error) {
      toast.error('Failed to update assignment status.');
    }
  };

  const handleDeleteAssignment = async (assignmentId: string) => {
    try {
      const result = await deleteTeachingAssignment(assignmentId);
      if (result.success) {
        toast.success('Assignment deleted successfully.');
      } else {
        toast.error(result.error);
      }
    } catch (error) {
      toast.error('Failed to delete assignment.');
    }
  };

  return (
    <>
      <div>
        <div className="flex flex-wrap items-center gap-4 mb-6">
          <div className="relative flex-1 min-w-[300px]">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search by teacher, subject, grade, or section..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="PENDING">Pending</SelectItem>
              <SelectItem value="ASSIGNED">Assigned</SelectItem>
              <SelectItem value="COMPLETED">Completed</SelectItem>
              <SelectItem value="INACTIVE">Inactive</SelectItem>
            </SelectContent>
          </Select>

          <Select value={gradeFilter} onValueChange={setGradeFilter}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Grade" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Grades</SelectItem>
              {formData.grades.map((grade) => (
                <SelectItem key={grade.id} value={grade.id}>
                  Grade {grade.grade}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={subjectFilter} onValueChange={setSubjectFilter}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Subject" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Subjects</SelectItem>
              {formData.subjects.map((subject) => (
                <SelectItem key={subject.id} value={subject.id}>
                  {subject.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Assignments Table */}
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Teacher</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead>Class</TableHead>
                <TableHead className="whitespace-nowrap">
                  Academic Year
                </TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAssignments.map((assignment) => {
                const StatusIcon = statusConfig[assignment.status].icon;
                return (
                  <TableRow key={assignment.id}>
                    <TableCell className="whitespace-nowrap">
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage
                            src={
                              assignment.teacher.user.profileImage ||
                              '/placeholder.svg'
                            }
                          />
                          <AvatarFallback>
                            {assignment.teacher.user.firstName[0]}
                            {assignment.teacher.user.lastName[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">
                            {assignment.teacher.user.firstName}{' '}
                            {assignment.teacher.user.lastName}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {assignment.teacher.employeeCode &&
                              `${assignment.teacher.employeeCode} • `}
                            {assignment.teacher.user.email}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="whitespace-nowrap">
                      <div>
                        <div className="font-medium">
                          {assignment.subject.name}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {assignment.subject.code}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="whitespace-nowrap">
                      <div className="font-medium">
                        {assignment.grade.grade} - {assignment.section.name}
                      </div>
                    </TableCell>
                    <TableCell className="whitespace-nowrap">
                      {assignment.AcademicYear?.name || 'Not specified'}
                    </TableCell>
                    <TableCell>
                      <Badge className={statusConfig[assignment.status].color}>
                        <StatusIcon className="mr-1 h-3 w-3" />
                        {statusConfig[assignment.status].label}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {new Date(assignment.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Change Status</DropdownMenuLabel>
                          {Object.entries(statusConfig).map(
                            ([status, config]) => (
                              <DropdownMenuItem
                                key={status}
                                onClick={() =>
                                  handleStatusChange(
                                    assignment.id,
                                    status as AssignmentStatus
                                  )
                                }
                                disabled={assignment.status === status}
                              >
                                <config.icon className="mr-2 h-4 w-4" />
                                {config.label}
                              </DropdownMenuItem>
                            )
                          )}
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() =>
                              handleDeleteAssignment(assignment.id)
                            }
                            className="text-red-600"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>

        {filteredAssignments.length === 0 && (
          <div className="text-center py-8">
            <p className="text-muted-foreground">
              No teaching assignments found matching your criteria.
            </p>
          </div>
        )}
      </div>

      {/* Edit Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Teaching Assignment</DialogTitle>
            <DialogDescription>
              Update the teaching assignment details.
            </DialogDescription>
          </DialogHeader>
          {selectedAssignment && (
            <AddTeachingAssignmentForm formData={formData} />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default TeachingAssignmentsTable;
