import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Download,
  TrendingUp,
  TrendingDown,
  Minus,
  Award,
  BookOpen,
  Clock,
  Target,
} from 'lucide-react';

// Dummy data
const academicData = {
  overallGPA: 3.8,
  attendance: 92,
  assignmentsCompleted: 45,
  assignmentsTotal: 50,
  currentGrade: 'A',
  rank: 15,
  totalStudents: 120,
};

const subjects = [
  { name: 'Mathematics', grade: 'A', score: 92, progress: 92, trend: 'up' },
  { name: 'Science', grade: 'A-', score: 89, progress: 89, trend: 'up' },
  { name: 'English', grade: 'B+', score: 87, progress: 87, trend: 'down' },
  { name: 'History', grade: 'A', score: 94, progress: 94, trend: 'up' },
  {
    name: 'Computer Science',
    grade: 'A',
    score: 96,
    progress: 96,
    trend: 'up',
  },
  { name: 'Art', grade: 'B', score: 85, progress: 85, trend: 'stable' },
];

const assignments = [
  {
    name: 'Algebra Final Exam',
    subject: 'Mathematics',
    dueDate: '2024-01-15',
    score: 95,
    total: 100,
    status: 'graded',
  },
  {
    name: 'Science Project',
    subject: 'Science',
    dueDate: '2024-01-20',
    score: 88,
    total: 100,
    status: 'graded',
  },
  {
    name: 'Essay Writing',
    subject: 'English',
    dueDate: '2024-01-25',
    score: null,
    total: 100,
    status: 'pending',
  },
  {
    name: 'World History Quiz',
    subject: 'History',
    dueDate: '2024-01-18',
    score: 90,
    total: 100,
    status: 'graded',
  },
];

const gradeHistory = [
  { period: 'Semester 1', gpa: 3.7, trend: 'up' },
  { period: 'Semester 2', gpa: 3.8, trend: 'up' },
  { period: 'Semester 3', gpa: 3.6, trend: 'down' },
  { period: 'Semester 4', gpa: 3.9, trend: 'up' },
];

export default function StudentAcademicPerformance() {
  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'down':
        return <TrendingDown className="h-4 w-4 text-red-500" />;
      default:
        return <Minus className="h-4 w-4 text-yellow-500" />;
    }
  };

  const getGradeColor = (grade: string) => {
    if (grade.includes('A'))
      return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
    if (grade.includes('B'))
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
    if (grade.includes('C'))
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
    return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-lg font-bold tracking-tight">
            Academic Performance
          </h2>
          <p className="text-slate-600 dark:text-slate-400">
            Track your academic progress and performance metrics
          </p>
        </div>
        <Button variant="outline" className="gap-2">
          <Download className="h-4 w-4" />
          Download Report
        </Button>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overall GPA</CardTitle>
            <Award className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{academicData.overallGPA}</div>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Current semester
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Attendance</CardTitle>
            <Clock className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{academicData.attendance}%</div>
            <Progress value={academicData.attendance} className="h-2 mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Assignments</CardTitle>
            <BookOpen className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {academicData.assignmentsCompleted}/
              {academicData.assignmentsTotal}
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              {(
                (academicData.assignmentsCompleted /
                  academicData.assignmentsTotal) *
                100
              ).toFixed(0)}
              % completed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Class Rank</CardTitle>
            <Target className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">#{academicData.rank}</div>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Top{' '}
              {((academicData.rank / academicData.totalStudents) * 100).toFixed(
                1
              )}
              % of class
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="subjects" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="subjects">Subjects</TabsTrigger>
          <TabsTrigger value="assignments">Assignments</TabsTrigger>
          <TabsTrigger value="history">Grade History</TabsTrigger>
        </TabsList>

        {/* Subjects Tab */}
        <TabsContent value="subjects" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Subject Performance</CardTitle>
              <CardDescription>
                Detailed breakdown of performance across all subjects
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {subjects.map((subject, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center space-x-4 flex-1">
                      <div className="flex-shrink-0 w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center justify-center">
                        <span className="font-bold text-slate-700 dark:text-slate-300">
                          {subject.name.charAt(0)}
                        </span>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <h4 className="font-medium">{subject.name}</h4>
                          <Badge
                            variant="secondary"
                            className={getGradeColor(subject.grade)}
                          >
                            {subject.grade}
                          </Badge>
                          {getTrendIcon(subject.trend)}
                        </div>
                        <Progress
                          value={subject.progress}
                          className="h-2 mt-2"
                        />
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold">{subject.score}%</div>
                      <div className="text-sm text-slate-600 dark:text-slate-400">
                        Score
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Assignments Tab */}
        <TabsContent value="assignments" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Assignments</CardTitle>
              <CardDescription>
                Track your assignment submissions and grades
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {assignments.map((assignment, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex items-center space-x-4">
                      <div
                        className={`w-3 h-3 rounded-full ${
                          assignment.status === 'graded'
                            ? 'bg-green-500'
                            : 'bg-yellow-500'
                        }`}
                      />
                      <div>
                        <h4 className="font-medium">{assignment.name}</h4>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          {assignment.subject} • Due{' '}
                          {new Date(assignment.dueDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      {assignment.score !== null ? (
                        <>
                          <div className="text-xl font-bold text-green-600">
                            {assignment.score}/{assignment.total}
                          </div>
                          <Badge
                            variant="secondary"
                            className="bg-green-100 text-green-800"
                          >
                            Graded
                          </Badge>
                        </>
                      ) : (
                        <Badge
                          variant="secondary"
                          className="bg-yellow-100 text-yellow-800"
                        >
                          Pending
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Grade History Tab */}
        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Academic History</CardTitle>
              <CardDescription>
                Your GPA progression over previous semesters
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {gradeHistory.map((semester, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex items-center space-x-4">
                      {getTrendIcon(semester.trend)}
                      <div>
                        <h4 className="font-medium">{semester.period}</h4>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          Academic performance
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold">{semester.gpa}</div>
                      <div className="text-sm text-slate-600 dark:text-slate-400">
                        GPA
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* GPA Trend Visualization */}
              <div className="mt-6 p-4 border rounded-lg bg-slate-50 dark:bg-slate-800">
                <h4 className="font-medium mb-4">GPA Trend Visualization</h4>
                <div className="flex items-end justify-between h-32 space-x-2">
                  {gradeHistory.map((semester, index) => (
                    <div
                      key={index}
                      className="flex flex-col items-center flex-1"
                    >
                      <div
                        className={`w-full rounded-t ${
                          semester.trend === 'up'
                            ? 'bg-green-500'
                            : semester.trend === 'down'
                              ? 'bg-red-500'
                              : 'bg-yellow-500'
                        }`}
                        style={{ height: `${semester.gpa * 20}%` }}
                      />
                      <span className="text-xs mt-2 text-slate-600 dark:text-slate-400">
                        {semester.period.split(' ')[1]}
                      </span>
                      <span className="text-sm font-medium">
                        {semester.gpa}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Performance Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Performance Summary</CardTitle>
          <CardDescription>
            Overall academic standing and recommendations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-medium">Strengths</h4>
              <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                <li className="flex items-center space-x-2">
                  <TrendingUp className="h-4 w-4 text-green-500" />
                  <span>
                    Excellent performance in Mathematics and Computer Science
                  </span>
                </li>
                <li className="flex items-center space-x-2">
                  <TrendingUp className="h-4 w-4 text-green-500" />
                  <span>Consistent assignment submission rate</span>
                </li>
                <li className="flex items-center space-x-2">
                  <TrendingUp className="h-4 w-4 text-green-500" />
                  <span>Strong attendance record</span>
                </li>
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="font-medium">Areas for Improvement</h4>
              <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                <li className="flex items-center space-x-2">
                  <TrendingDown className="h-4 w-4 text-red-500" />
                  <span>English grades showing slight decline</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-yellow-500" />
                  <span>Focus on improving Art subject performance</span>
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
