import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface ListSkeletonProps {
    count?: number;
    hasAvatar?: boolean;
    className?: string;
}

export function ListSkeleton({ count = 4, hasAvatar = true, className }: ListSkeletonProps) {
    return (
        <div className={cn("space-y-3", className)}>
            {Array.from({ length: count }).map((_, i) => (
                <div key={i} className="flex items-center gap-4 p-3 border rounded-xl animate-pulse bg-accent/30">
                    {hasAvatar && <Skeleton className="h-10 w-10 rounded-full" />}
                    <div className="flex-1 space-y-2">
                        <Skeleton className="h-4 w-1/3" />
                        <Skeleton className="h-3 w-1/2" />
                    </div>
                    <Skeleton className="h-8 w-8 rounded-lg" />
                </div>
            ))}
        </div>
    );
}

export function ListCardSkeleton({ count = 3, className }: { count?: number; className?: string }) {
    return (
        <div className={cn("grid gap-4 md:grid-cols-2 lg:grid-cols-3", className)}>
            {Array.from({ length: count }).map((_, i) => (
                <Card key={i} className="animate-pulse border-none shadow-none bg-accent/50">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-4">
                            <Skeleton className="h-5 w-24" />
                            <Skeleton className="h-8 w-8 rounded-lg" />
                        </div>
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-2/3" />
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
