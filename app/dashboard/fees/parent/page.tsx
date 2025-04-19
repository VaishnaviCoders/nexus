import { Suspense } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import { DashboardCardSkeleton } from '@/lib/skeletons/DashboardCardSkeleton';
import { Calendar, Receipt, User } from 'lucide-react';
import ParentFeeHistory from '@/app/components/dashboardComponents/Fees/ParentDashboard';
import prisma from '@/lib/db';

// Sample parent data with multiple children

const data = await prisma.parent.findUnique({
  where: {
    id: 'cm838j5oe0009vhnoehp1elg6',
  },
  select: {
    firstName: true,
    lastName: true,
    email: true,
    phoneNumber: true,
    students: {
      select: {
        student: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            rollNumber: true,
            grade: {
              select: {
                grade: true,
              },
            },
            section: {
              select: {
                name: true,
              },
            },
            Fee: {
              select: {
                feeCategory: {
                  select: {
                    name: true,
                  },
                },
                id: true,
                dueDate: true,
                totalFee: true,
                paidAmount: true,
                pendingAmount: true,
                status: true,
              },
            },
          },
        },
      },
    },
  },
});

const parentData = {
  name: `Mr. ${data?.firstName} ${data?.lastName}`,
  email: data?.email || '',
  phone: data?.phoneNumber || '',
  children:
    data?.students.map(({ student }) => {
      const totalFees = student.Fee.reduce(
        (sum, fee) => sum + (fee.totalFee || 0),
        0
      );
      const paidFees = student.Fee.reduce(
        (sum, fee) => sum + (fee.paidAmount || 0),
        0
      );
      const pendingFees = student.Fee.reduce(
        (sum, fee) => sum + (fee.pendingAmount || 0),
        0
      );

      const pendingPayments = student.Fee.map((fee) => ({
        id: fee.id,
        dueDate: fee.dueDate,
        amount: fee.pendingAmount || 0,
        category: fee.feeCategory?.name || 'Unknown',
        status: fee.status,
      }));

      return {
        id: student.id,
        name: `${student.firstName} ${student.lastName}`,
        grade: student.grade?.grade || 'Unknown',
        section: student.section?.name || 'Unknown',
        rollNo: student.rollNumber || 'N/A',
        totalFees,
        paidFees,
        pendingFees,
        pendingPayments,
      };
    }) || [],
  paymentHistory: [],
};

// const parentData = {
//   name: 'Mr. Rajesh Sharma',
//   email: 'rajesh.sharma@example.com',
//   phone: '+91 9876543210',
//   children: [
//     {
//       id: '1',
//       name: 'Rahul Sharma',
//       grade: '10th',
//       section: 'A',
//       rollNo: '1001',
//       totalFees: 45000,
//       paidFees: 25000,
//       pendingFees: 20000,
//       pendingPayments: [
//         {
//           id: 'pp1',
//           dueDate: new Date(2023, 7, 15),
//           amount: 12000,
//           category: 'Exam Fee',
//           status: 'UNPAID',
//         },
//         {
//           id: 'pp2',
//           dueDate: new Date(2023, 6, 5),
//           amount: 8000,
//           category: 'Lab Fee',
//           status: 'OVERDUE',
//         },
//         {
//           id: 'pp3',
//           dueDate: new Date(2023, 6, 5),
//           amount: 89000,
//           category: 'Lab Fee',
//           status: 'OVERDUE',
//         },
//       ],
//     },
//     {
//       id: '2',
//       name: 'Riya Sharma',
//       grade: '8th',
//       section: 'B',
//       rollNo: '801',
//       totalFees: 35000,
//       paidFees: 35000,
//       pendingFees: 0,
//       pendingPayments: [],
//     },
//   ],
//   paymentHistory: [
//     {
//       id: 'p1',
//       date: new Date(2023, 4, 15),
//       amount: 15000,
//       category: 'Annual Fee',
//       receiptNo: 'REC-001',
//       paymentMethod: 'Online',
//       childName: 'Rahul Sharma',
//     },
//     {
//       id: 'p2',
//       date: new Date(2023, 5, 10),
//       amount: 10000,
//       category: 'Term Fee',
//       receiptNo: 'REC-002',
//       paymentMethod: 'Bank Transfer',
//       childName: 'Rahul Sharma',
//     },
//     {
//       id: 'p3',
//       date: new Date(2023, 4, 20),
//       amount: 20000,
//       category: 'Annual Fee',
//       receiptNo: 'REC-003',
//       paymentMethod: 'Online',
//       childName: 'Riya Sharma',
//     },
//     {
//       id: 'p4',
//       date: new Date(2023, 5, 15),
//       amount: 15000,
//       category: 'Term Fee',
//       receiptNo: 'REC-004',
//       paymentMethod: 'Credit Card',
//       childName: 'Riya Sharma',
//     },
//   ],
// };

export default function ParentDashboard() {
  // const [selectedChild, setSelectedChild] = useState(parentData.children[0].id);

  const totalFees = parentData.children.reduce(
    (sum, child) => sum + child.totalFees,
    0
  );
  const totalPaid = parentData.children.reduce(
    (sum, child) => sum + child.paidFees,
    0
  );
  const totalPending = parentData.children.reduce(
    (sum, child) => sum + child.pendingFees,
    0
  );
  const paymentPercentage = Math.round((totalPaid / totalFees) * 100);

  return (
    <div className="">
      <main className="flex flex-1 flex-col gap-4">
        <div className="flex items-center justify-between mx-2">
          <h1 className="text-2xl font-bold tracking-tight">
            Parent Dashboard
          </h1>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Suspense fallback={<DashboardCardSkeleton />}>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Children
                </CardTitle>
                <User className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {parentData.children.length}
                </div>
                <p className="text-xs text-muted-foreground">
                  Enrolled in school
                </p>
              </CardContent>
            </Card>
          </Suspense>
          <Suspense fallback={<DashboardCardSkeleton />}>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Fees
                </CardTitle>
                <Receipt className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  ₹{totalFees.toLocaleString()}
                </div>
                <p className="text-xs text-muted-foreground">
                  For all children
                </p>
              </CardContent>
            </Card>
          </Suspense>
          <Suspense fallback={<DashboardCardSkeleton />}>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Paid Amount
                </CardTitle>
                <Receipt className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  ₹{totalPaid.toLocaleString()}
                </div>
                <div className="flex items-center">
                  <p className="text-xs text-muted-foreground">
                    {paymentPercentage}% of total fees
                  </p>
                </div>
              </CardContent>
            </Card>
          </Suspense>
          <Suspense fallback={<DashboardCardSkeleton />}>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Pending Amount
                </CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-amber-600">
                  ₹{totalPending.toLocaleString()}
                </div>
                <p className="text-xs text-muted-foreground">Due payments</p>
              </CardContent>
            </Card>
          </Suspense>
        </div>
        <ParentFeeHistory parentData={parentData} />
      </main>
    </div>
  );
}
