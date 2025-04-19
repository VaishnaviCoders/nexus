import { getDashboardStats } from '@/app/actions';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import prisma from '@/lib/db';
import { getOrganizationId } from '@/lib/organization';
import {
  CalendarDays,
  CreditCard,
  IndianRupee,
  Users,
  BookOpen,
  School,
  AlertTriangle,
} from 'lucide-react';
import Link from 'next/link';
// import { RevenueChart } from '@/components/dashboard/revenue-chart';
// import { RecentPayments } from '@/components/dashboard/recent-payments';
// import { FeeStatusOverview } from '@/components/dashboard/fee-status-overview';

export default async function Dashboard() {
  const orgId = await getOrganizationId();

  const { feeCategoryCount, totalRevenue, pendingFees, totalStudents } =
    await getDashboardStats(orgId);

  return (
    <div className="">
      <main className="flex flex-1 flex-col gap-4 ">
        <div className="flex items-center justify-between mx-2">
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight">
            Fees Dashboard
          </h1>
          <div className="flex items-center gap-2">
            <Button asChild>
              <Link href="/dashboard/fees/admin/fee-categories">
                <CreditCard className="mr-2 h-2 w-2" />
                Fee Category
              </Link>
            </Button>
            <Button asChild>
              <Link href="/dashboard/fees/admin/assign">
                <CreditCard className="mr-2 h-4 w-4" />
                Assign Fees
              </Link>
            </Button>
          </div>
        </div>
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Revenue
                  </CardTitle>
                  <IndianRupee className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    ₹{new Intl.NumberFormat('en-IN').format(totalRevenue)}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    +20.1% from last month
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Pending Fees
                  </CardTitle>
                  <AlertTriangle className="h-4 w-4 animate-pulse fill-yellow-500  text-muted-foreground " />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    ₹{new Intl.NumberFormat('en-IN').format(pendingFees)}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    42 students with pending fees
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Students
                  </CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{totalStudents}</div>
                  <p className="text-xs text-muted-foreground">
                    +3 new this month
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Fee Categories
                  </CardTitle>
                  <BookOpen className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{feeCategoryCount}</div>
                  <p className="text-xs text-muted-foreground">
                    Across all grades
                  </p>
                </CardContent>
              </Card>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
              <Card className="col-span-4">
                <CardHeader>
                  <CardTitle>Revenue Overview</CardTitle>
                </CardHeader>
                <CardContent className="pl-2">
                  {/* <RevenueChart /> */}
                </CardContent>
              </Card>
              <Card className="col-span-3">
                <CardHeader>
                  <CardTitle>Fee Status Overview</CardTitle>
                  <CardDescription>
                    Distribution of fee payment status
                  </CardDescription>
                </CardHeader>
                <CardContent>{/* <FeeStatusOverview /> */}</CardContent>
              </Card>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-1">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Payments</CardTitle>
                  <CardDescription>
                    Latest fee payments across all grades
                  </CardDescription>
                </CardHeader>
                <CardContent>{/* <RecentPayments /> */}</CardContent>
              </Card>
            </div>
          </TabsContent>
          <TabsContent value="analytics" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Fee Collection Analytics</CardTitle>
                <CardDescription>
                  Detailed analysis of fee collection across grades and
                  categories
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p>Analytics content will be displayed here</p>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="reports" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Fee Reports</CardTitle>
                <CardDescription>
                  Generate and download detailed fee reports
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p>Reports content will be displayed here</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
