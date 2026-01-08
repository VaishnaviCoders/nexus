import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface PageHeaderSkeletonProps {
    className?: string;
}

export function PageHeaderSkeleton({ className }: PageHeaderSkeletonProps) {
    return (
        <Card className={cn("py-4 px-4 flex items-center justify-between", className)}>
            <div className="space-y-2">
                <Skeleton className="h-6 w-32 md:w-48" />
                <Skeleton className="h-4 w-48 md:w-64" />
            </div>
            <div className="flex items-center gap-3">
                <Skeleton className="h-9 w-24 md:w-32" />
            </div>
        </Card>
    );
}
