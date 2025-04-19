export function DashboardCardSkeleton() {
  return (
    <div className="animate-pulse  p-4 border-gray-50 border-2 rounded-lg">
      <div className="flex justify-between items-center pb-2">
        <div className="font-medium text-sm w-52 bg-gray-200 rounded-lg h-8"></div>

        <div className="h-8 w-8 bg-gray-200 rounded"></div>
      </div>
      <div className="flex-1 space-y-6 py-1">
        <div className="space-y-3">
          <div className="grid grid-cols-3 gap-4">
            <div className="h-2 bg-gray-300 rounded col-span-2"></div>
          </div>
          <div className="h-2 bg-gray-300 rounded"></div>
        </div>
      </div>
    </div>
  );
}
