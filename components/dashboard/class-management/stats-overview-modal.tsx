import { Card, CardContent } from '@/components/ui/card';
import { GraduationCap, BookOpen, Users, TrendingUp } from 'lucide-react';

interface StatsOverviewProps {
  totalGrades: number;
  totalSections: number;
  totalStudents: number;
}

export function StatsOverview({
  totalGrades,
  totalSections,
  totalStudents,
}: StatsOverviewProps) {
  const stats = [
    {
      title: 'Total Grades',
      value: totalGrades,
      icon: GraduationCap,
      color: 'bg-blue-500',
      bgColor: 'bg-blue-50 dark:bg-blue-950/20',
    },
    {
      title: 'Total Sections',
      value: totalSections,
      icon: BookOpen,
      color: 'bg-green-500',
      bgColor: 'bg-green-50 dark:bg-green-950/20',
    },
    {
      title: 'Total Students',
      value: totalStudents,
      icon: Users,
      color: 'bg-purple-500',
      bgColor: 'bg-purple-50 dark:bg-purple-950/20',
    },
    {
      title: 'Growth Rate',
      value: '+12%',
      icon: TrendingUp,
      color: 'bg-orange-500',
      bgColor: 'bg-orange-50 dark:bg-orange-950/20',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Card
            key={index}
            className={`${stat.bgColor} border-0 shadow-sm hover:shadow-md transition-shadow`}
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">
                    {stat.title}
                  </p>
                  <p className="text-3xl font-bold">{stat.value}</p>
                </div>
                <div
                  className={`w-12 h-12 ${stat.color} rounded-full flex items-center justify-center`}
                >
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
