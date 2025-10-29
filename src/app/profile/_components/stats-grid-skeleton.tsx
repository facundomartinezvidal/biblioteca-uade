import { Skeleton } from "~/components/ui/skeleton";

export function StatsGridSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="rounded-md bg-gray-50 p-4">
          <div className="flex items-center justify-center gap-2">
            <Skeleton className="h-4 w-4 rounded-full" />
            <Skeleton className="h-4 w-24" />
          </div>
          <Skeleton className="mx-auto mt-2 h-8 w-12" />
          <Skeleton className="mx-auto mt-1 h-4 w-16" />
        </div>
      ))}
    </div>
  );
}
