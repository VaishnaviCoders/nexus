'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
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
  Edit,
  Eye,
  MoreHorizontal,
  Search,
  Trash2,
  UserCheck,
  UserX,
} from 'lucide-react';
import { TeacherProfile, User } from '@/generated/prisma/client';
import { EmploymentStatus } from '@/generated/prisma/enums';
import { getStatusConfig, TeacherDetailsModal } from './TeacherDetailsModal';
import { toggleTeacherStatus } from '@/app/actions';

interface TeachersProps {
  teachers: {
    id: string;
    employeeCode: string | null;
    isActive: boolean;
    employmentStatus: EmploymentStatus;
    organizationId: string;
    createdAt: Date;
    updatedAt: Date;
    userId: string;
    profile: TeacherProfile | null;
    user: User;
  }[];
}

export type SelectedTeacher = {
  id: string;
  employeeCode: string | null;
  isActive: boolean;
  employmentStatus: EmploymentStatus;
  organizationId: string;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  profile: TeacherProfile | null;
  user: User;
} | null;

const TeachersTable = ({ teachers }: TeachersProps) => {
  console.log('teachers', teachers);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [employmentFilter, setEmploymentFilter] = useState('all');
  const [selectedTeacher, setSelectedTeacher] = useState<SelectedTeacher>(null);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isBulkImportOpen, setIsBulkImportOpen] = useState(false);

  const filteredTeachers = teachers.filter((teacher) => {
    const matchesSearch =
      teacher.user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      teacher.user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      teacher.user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (teacher.employeeCode ?? '')
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === 'all' ||
      (statusFilter === 'active' && teacher.isActive) ||
      (statusFilter === 'inactive' && !teacher.isActive);

    const matchesEmployment =
      employmentFilter === 'all' ||
      teacher.employmentStatus === employmentFilter;

    return matchesSearch && matchesStatus && matchesEmployment;
  });

  const handleViewDetails = (teacher: SelectedTeacher) => {
    setSelectedTeacher(teacher);
    setIsDetailsModalOpen(true);
  };

  const handleEditTeacher = (teacher: any) => {
    setSelectedTeacher(teacher);
    setIsEditModalOpen(true);
  };

  const handleToggleStatus = async (teacherId: string) => {
    await toggleTeacherStatus(teacherId);
  };

  const handleDeleteTeacher = async (teacherId: string) => {};

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Teachers Directory</CardTitle>
          <CardDescription>
            View and manage all teaching staff members
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4 mb-6">
            <div className="relative flex-1 ">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search teachers by name, email, or employee code..."
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
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={employmentFilter}
              onValueChange={setEmploymentFilter}
            >
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Employment" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Employment</SelectItem>
                <SelectItem value="ACTIVE">Active</SelectItem>
                <SelectItem value="ON_LEAVE">On Leave</SelectItem>
                <SelectItem value="PROBATION">Probation</SelectItem>
                <SelectItem value="SUSPENDED">Suspended</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Teachers Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Teacher</TableHead>
                  <TableHead className="whitespace-nowrap">
                    Employee Code
                  </TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Qualification</TableHead>
                  <TableHead>Experience</TableHead>
                  <TableHead>Subjects</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTeachers.map((teacher) => {
                  console.log('teacher', teacher);
                  const statusConfig = getStatusConfig(
                    teacher.employmentStatus,
                    teacher.isActive
                  );
                  return (
                    <TableRow key={teacher.id}>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage
                              src={
                                teacher.user.profileImage || '/placeholder.svg'
                              }
                            />
                            <AvatarFallback>
                              {teacher.user.firstName[0]}
                              {teacher.user.lastName[0]}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">
                              {teacher.user.firstName} {teacher.user.lastName}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {teacher.user.email}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="font-mono text-sm whitespace-nowrap">
                        {teacher.employeeCode ?? '-'}
                      </TableCell>
                      <TableCell>
                        {teacher.profile?.contactPhone ?? '—'}
                      </TableCell>
                      <TableCell>
                        {teacher.profile?.qualification ?? '—'}
                      </TableCell>

                      <TableCell>
                        {teacher.profile?.experienceInYears} Years
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {teacher.profile?.specializedSubjects
                            .slice(0, 2)
                            .map((subject) => (
                              <Badge
                                key={subject}
                                variant="outline"
                                className="text-xs"
                              >
                                {subject}
                              </Badge>
                            ))}
                          {/* {teacher.profile.specializedSubjects.length > 2 && (
                        <Badge variant="outline" className="text-xs">
                          +{teacher.profile.specializedSubjects.length - 2}
                        </Badge>
                      )} */}
                        </div>
                      </TableCell>
                      <TableCell>
                        {' '}
                        <Badge
                          className={`${statusConfig.color} border font-medium px-3 py-1 hover:bg-${statusConfig.color}-100 cursor-pointer`}
                        >
                          <div
                            className={`w-2 h-2 rounded-full ${statusConfig.dot} mr-2`}
                          />
                          {statusConfig.label}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem
                              onClick={() => handleViewDetails(teacher)}
                            >
                              <Eye className="mr-2 h-4 w-4" />
                              View Details
                            </DropdownMenuItem>
                            {/* <DropdownMenuItem
                            onClick={() => handleEditTeacher(teacher)}
                          >
                            <Edit className="mr-2 h-4 w-4" />
                            Edit Teacher
                          </DropdownMenuItem> */}
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => handleToggleStatus(teacher.id)}
                            >
                              {teacher.isActive ? (
                                <>
                                  <UserX className="mr-2 h-4 w-4" />
                                  Deactivate
                                </>
                              ) : (
                                <>
                                  <UserCheck className="mr-2 h-4 w-4" />
                                  Activate
                                </>
                              )}
                            </DropdownMenuItem>
                            {/* <DropdownMenuItem
                            onClick={() => handleDeleteTeacher(teacher.id)}
                            className="text-red-600"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem> */}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>

          {filteredTeachers.length === 0 && (
            <div className="text-center py-8">
              <p className="text-muted-foreground">
                No teachers found matching your criteria.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
      <TeacherDetailsModal
        teacher={selectedTeacher}
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
      />

      {/* <BulkImportModal
        isOpen={isBulkImportOpen}
        onClose={() => setIsBulkImportOpen(false)}
      /> */}
    </>
  );
};

export default TeachersTable;
