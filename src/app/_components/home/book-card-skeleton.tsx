"use client";

import { Card } from "~/components/ui/card";
import { Skeleton } from "~/components/ui/skeleton";

type BookCardSkeletonProps = {
  className?: string;
};

export default function BookCardSkeleton({ className }: BookCardSkeletonProps) {
  return (
    <div className={["flex", className].filter(Boolean).join(" ")}>
      {/* Image container skeleton */}
      <div className="bg-muted/20 border-muted/20 relative aspect-[2/3] w-[180px] flex-shrink-0 overflow-hidden rounded-l-lg border border-r-0">
        <Skeleton className="h-full w-full" />
      </div>

      {/* Content container skeleton */}
      <Card className="bg-card relative flex-1 overflow-hidden rounded-l-none border-0 p-4">
        <div className="flex flex-1 flex-col">
          <div className="flex items-start justify-between gap-4">
            {/* Title and author skeleton */}
            <div className="flex-1 space-y-2">
              <Skeleton className="h-6 w-3/4" />
              <div className="flex items-center gap-1">
                <Skeleton className="h-4 w-4" />
                <Skeleton className="h-4 w-24" />
              </div>
              <div className="flex items-center gap-1">
                <Skeleton className="h-4 w-4" />
                <Skeleton className="h-4 w-20" />
              </div>
            </div>

            {/* Favorite button skeleton */}
            <Skeleton className="h-10 w-10 shrink-0" />
          </div>

          {/* Description skeleton */}
          <div className="mt-3 space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-4/5" />
          </div>

          {/* ISBN and location skeleton */}
          <div className="mt-3 space-y-1">
            <div className="flex items-center gap-2">
              <Skeleton className="h-4 w-4" />
              <Skeleton className="h-4 w-8" />
              <Skeleton className="h-4 w-32" />
            </div>
            <div className="flex items-center gap-2">
              <Skeleton className="h-4 w-4" />
              <Skeleton className="h-4 w-28" />
            </div>
          </div>

          {/* Availability badge skeleton */}
          <div className="mt-3 flex items-center justify-between">
            <Skeleton className="h-6 w-20 rounded-full" />
          </div>

          {/* Buttons skeleton */}
          <div className="mt-4 flex gap-2">
            <Skeleton className="h-9 flex-1" />
            <Skeleton className="h-9 flex-1" />
          </div>
        </div>
      </Card>
    </div>
  );
}
