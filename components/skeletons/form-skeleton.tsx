import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface FormSkeletonProps {
    fields?: number;
    className?: string;
}

export function FormSkeleton({ fields = 4, className }: FormSkeletonProps) {
    return (
        <Card className={cn("border-none shadow-none bg-accent/50", className)}>
            <CardHeader>
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-4 w-48" />
            </CardHeader>
            <CardContent className="space-y-6">
                {Array.from({ length: fields }).map((_, i) => (
                    <div key={i} className="space-y-2">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-10 w-full rounded-lg" />
                    </div>
                ))}
            </CardContent>
            <CardFooter className="justify-end gap-3">
                <Skeleton className="h-10 w-24" />
                <Skeleton className="h-10 w-32" />
            </CardFooter>
        </Card>
    );
}
