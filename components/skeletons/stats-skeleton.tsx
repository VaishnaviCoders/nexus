import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface StatsSkeletonProps {
    count?: number;
    className?: string;
}

export function StatsSkeleton({ count = 4, className }: StatsSkeletonProps) {
    return (
        <div className={cn("grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4", className)}>
            {Array.from({ length: count }).map((_, i) => (
                <Card key={i} className="animate-pulse border-none shadow-none bg-accent/50">
                    <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
                        <Skeleton className="h-4 w-20" />
                        <Skeleton className="h-8 w-8 rounded-lg" />
                    </CardHeader>
                    <CardContent>
                        <Skeleton className="h-8 w-12 mb-1" />
                        <Skeleton className="h-3 w-24" />
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
