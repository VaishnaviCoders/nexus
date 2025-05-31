'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Phone,
  Mail,
  Calendar,
  GraduationCap,
  Users,
  BarChart3,
  Edit,
  Download,
} from 'lucide-react';

interface StudentProfileProps {
  student: any;
  userRole: 'ADMIN' | 'STUDENT' | 'TEACHER' | 'PARENT';
}

export function StudentProfile({ student, userRole }: StudentProfileProps) {
  const isAdmin = userRole === 'ADMIN';
  const isStudent = userRole === 'STUDENT';

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            Student Profile
          </h1>
          <p className="text-sm text-gray-500">
            {isAdmin
              ? 'Manage student information and records'
              : 'View your academic information'}
          </p>
        </div>
        {isAdmin && (
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button size="sm">
              <Edit className="h-4 w-4 mr-2" />
              Edit Profile
            </Button>
          </div>
        )}
      </div>

      {/* Profile Overview */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-start gap-6">
            <Avatar className="h-24 w-24">
              <AvatarImage
                src={student.profileImage || '/placeholder.svg'}
                alt={student.fullName}
              />
              <AvatarFallback className="text-lg">
                {student.firstName[0]}
                {student.lastName[0]}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 space-y-4">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  {student.fullName}
                </h2>
                <p className="text-sm text-gray-500">
                  Roll Number: {student.rollNumber}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center gap-2 text-sm">
                  <GraduationCap className="h-4 w-4 text-gray-400" />
                  <span>
                    Grade {student.grade.grade} - Section {student.section.name}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="h-4 w-4 text-gray-400" />
                  <span>{student.email}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-4 w-4 text-gray-400" />
                  <span>{student.phoneNumber}</span>
                </div>
              </div>
            </div>

            <div className="text-right space-y-2">
              <Badge variant="secondary">Active</Badge>
              <div className="text-sm text-gray-500">
                Attendance: {student.attendance.percentage}%
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Information Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="attendance">Attendance</TabsTrigger>
          <TabsTrigger value="fees">Fees</TabsTrigger>
          <TabsTrigger value="parents">Parents</TabsTrigger>
          {isAdmin && <TabsTrigger value="documents">Documents</TabsTrigger>}
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">
                  Personal Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">First Name:</span>
                    <p className="font-medium">{student.firstName}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Last Name:</span>
                    <p className="font-medium">{student.lastName}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Middle Name:</span>
                    <p className="font-medium">{student.middleName || 'N/A'}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Mother's Name:</span>
                    <p className="font-medium">{student.motherName}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Date of Birth:</span>
                    <p className="font-medium">
                      {student.dateOfBirth.toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-500">Gender:</span>
                    <p className="font-medium">{student.gender}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-3 text-sm">
                  <div>
                    <span className="text-gray-500">Email:</span>
                    <p className="font-medium">{student.email}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Phone Number:</span>
                    <p className="font-medium">{student.phoneNumber}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">WhatsApp Number:</span>
                    <p className="font-medium">{student.whatsAppNumber}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Emergency Contact:</span>
                    <p className="font-medium">{student.emergencyContact}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="attendance" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="text-2xl font-semibold">
                      {student.attendance.percentage}%
                    </p>
                    <p className="text-sm text-gray-500">Overall Attendance</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="text-2xl font-semibold">
                      {student.attendance.presentDays}
                    </p>
                    <p className="text-sm text-gray-500">Days Present</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-red-600" />
                  <div>
                    <p className="text-2xl font-semibold">
                      {student.attendance.absentDays}
                    </p>
                    <p className="text-sm text-gray-500">Days Absent</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="fees" className="space-y-4">
          <div className="space-y-4">
            {student.fees.map((fee: any) => (
              <Card key={fee.id}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <h3 className="font-medium">{fee.feeCategory.name}</h3>
                      <p className="text-sm text-gray-500">
                        {fee.feeCategory.description}
                      </p>
                    </div>
                    <div className="text-right space-y-1">
                      <Badge
                        variant={
                          fee.status === 'PAID' ? 'default' : 'destructive'
                        }
                      >
                        {fee.status}
                      </Badge>
                      <p className="text-sm text-gray-500">
                        Due: {fee.dueDate.toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Total Fee:</span>
                      <p className="font-medium">
                        ₹{fee.totalFee.toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-500">Paid Amount:</span>
                      <p className="font-medium text-green-600">
                        ₹{fee.paidAmount.toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-500">Pending Amount:</span>
                      <p className="font-medium text-red-600">
                        ₹{fee.pendingAmount.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="parents" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {student.parents.map((parent: any) => (
              <Card key={parent.id}>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <Avatar>
                      <AvatarFallback>
                        {parent.firstName[0]}
                        {parent.lastName[0]}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium">
                          {parent.firstName} {parent.lastName}
                        </h3>
                        {parent.isPrimary && (
                          <Badge variant="secondary" className="text-xs">
                            Primary
                          </Badge>
                        )}
                      </div>

                      <div className="space-y-1 text-sm">
                        <div className="flex items-center gap-2">
                          <Users className="h-3 w-3 text-gray-400" />
                          <span className="capitalize">
                            {parent.relationship.toLowerCase()}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Mail className="h-3 w-3 text-gray-400" />
                          <span>{parent.email}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="h-3 w-3 text-gray-400" />
                          <span>{parent.phoneNumber}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {isAdmin && (
          <TabsContent value="documents" className="space-y-4">
            <Card>
              <CardContent className="p-6">
                <div className="text-center py-8">
                  <p className="text-gray-500">No documents uploaded yet.</p>
                  <Button variant="outline" className="mt-4">
                    Upload Documents
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}
