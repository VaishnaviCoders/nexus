import { Card, CardContent, CardHeader } from "@/components/ui/card"

export function GradesSidebarSkeleton() {
  return (
    <Card className="h-full bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-slate-200 dark:bg-slate-700 rounded-lg animate-pulse" />
            <div className="w-16 h-6 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
          </div>
          <div className="w-8 h-8 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-4">
              <div className="w-20 h-5 bg-slate-200 dark:bg-slate-700 rounded mb-3" />
              <div className="space-y-2">
                <div className="flex justify-between">
                  <div className="w-16 h-4 bg-slate-200 dark:bg-slate-700 rounded" />
                  <div className="w-6 h-4 bg-slate-200 dark:bg-slate-700 rounded" />
                </div>
                <div className="flex justify-between">
                  <div className="w-16 h-4 bg-slate-200 dark:bg-slate-700 rounded" />
                  <div className="w-6 h-4 bg-slate-200 dark:bg-slate-700 rounded" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </CardContent>
    </Card>
  )
}

export function GradesStatsSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {[1, 2, 3, 4].map((i) => (
        <Card key={i} className="animate-pulse">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div className="w-20 h-4 bg-slate-200 dark:bg-slate-700 rounded" />
              <div className="w-8 h-8 bg-slate-200 dark:bg-slate-700 rounded-lg" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="w-12 h-8 bg-slate-200 dark:bg-slate-700 rounded" />
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

export function GradesOverviewSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="w-32 h-6 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
        <div className="w-24 h-10 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="w-20 h-6 bg-slate-200 dark:bg-slate-700 rounded" />
                <div className="w-8 h-8 bg-slate-200 dark:bg-slate-700 rounded-lg" />
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-slate-100 dark:bg-slate-700 rounded-lg">
                  <div className="w-16 h-3 bg-slate-200 dark:bg-slate-600 rounded mb-1" />
                  <div className="w-8 h-6 bg-slate-200 dark:bg-slate-600 rounded" />
                </div>
                <div className="p-3 bg-slate-100 dark:bg-slate-700 rounded-lg">
                  <div className="w-16 h-3 bg-slate-200 dark:bg-slate-600 rounded mb-1" />
                  <div className="w-8 h-6 bg-slate-200 dark:bg-slate-600 rounded" />
                </div>
              </div>
              <div className="w-full h-10 bg-slate-200 dark:bg-slate-700 rounded" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

export function GradeHeaderSkeleton() {
  return (
    <div className="p-6 border-b border-slate-200 dark:border-slate-700">
      <div className="flex items-center justify-between animate-pulse">
        <div className="flex items-center gap-4">
          <div className="w-8 h-8 bg-slate-200 dark:bg-slate-700 rounded" />
          <div>
            <div className="w-32 h-6 bg-slate-200 dark:bg-slate-700 rounded mb-2" />
            <div className="w-24 h-4 bg-slate-200 dark:bg-slate-700 rounded" />
          </div>
        </div>
        <div className="w-24 h-10 bg-slate-200 dark:bg-slate-700 rounded" />
      </div>
    </div>
  )
}

export function GradeDetailsSkeleton() {
  return (
    <Card className="animate-pulse">
      <CardHeader>
        <div className="w-32 h-6 bg-slate-200 dark:bg-slate-700 rounded" />
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="w-full h-20 bg-slate-200 dark:bg-slate-700 rounded" />
        <div className="w-full h-20 bg-slate-200 dark:bg-slate-700 rounded" />
      </CardContent>
    </Card>
  )
}

export function SectionsListSkeleton() {
  return (
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <Card key={i} className="animate-pulse">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="w-20 h-5 bg-slate-200 dark:bg-slate-700 rounded" />
              <div className="w-8 h-8 bg-slate-200 dark:bg-slate-700 rounded" />
            </div>
            <div className="w-32 h-4 bg-slate-200 dark:bg-slate-700 rounded" />
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

export function GradeAnalyticsSkeleton() {
  return (
    <Card className="animate-pulse">
      <CardHeader>
        <div className="w-24 h-6 bg-slate-200 dark:bg-slate-700 rounded" />
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="w-full h-32 bg-slate-200 dark:bg-slate-700 rounded" />
        <div className="w-full h-32 bg-slate-200 dark:bg-slate-700 rounded" />
      </CardContent>
    </Card>
  )
}

export function SectionDetailsSkeleton() {
  return (
    <Card className="animate-pulse">
      <CardHeader>
        <div className="w-32 h-6 bg-slate-200 dark:bg-slate-700 rounded" />
      </CardHeader>
      <CardContent>
        <div className="w-full h-24 bg-slate-200 dark:bg-slate-700 rounded" />
      </CardContent>
    </Card>
  )
}

export function StudentsListSkeleton() {
  return (
    <Card className="animate-pulse">
      <CardHeader>
        <div className="w-24 h-6 bg-slate-200 dark:bg-slate-700 rounded" />
      </CardHeader>
      <CardContent className="space-y-3">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="flex items-center gap-4 p-3 border border-slate-200 dark:border-slate-700 rounded-lg">
            <div className="w-10 h-10 bg-slate-200 dark:bg-slate-700 rounded-full" />
            <div className="flex-1">
              <div className="w-32 h-4 bg-slate-200 dark:bg-slate-700 rounded mb-1" />
              <div className="w-24 h-3 bg-slate-200 dark:bg-slate-700 rounded" />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
