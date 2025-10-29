"use client";

import { Card, CardContent } from "~/components/ui/card";
import { Skeleton } from "~/components/ui/skeleton";
import BookCardSkeleton from "~/app/_components/home/book-card-skeleton";

export function ReservePageSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto py-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Left section - Book information skeleton */}
          <div className="flex flex-col">
            <h2 className="text-berkeley-blue mb-6 text-xl font-semibold">
              Información del libro
            </h2>

            <Card className="flex-1 shadow-sm">
              <CardContent className="flex h-full flex-col">
                <div className="flex gap-6">
                  {/* Cover skeleton */}
                  <div className="flex-shrink-0">
                    <Skeleton className="h-64 w-44 rounded" />
                  </div>

                  {/* Book information skeleton */}
                  <div className="flex flex-1 flex-col space-y-6">
                    <div>
                      <Skeleton className="mb-1 h-8 w-3/4" />
                      <Skeleton className="h-4 w-1/2" />
                    </div>

                    <div className="flex flex-1 flex-col justify-between">
                      <div className="grid grid-cols-2 gap-x-4 gap-y-6">
                        <div className="space-y-1">
                          <Skeleton className="h-4 w-12" />
                          <Skeleton className="h-4 w-full" />
                        </div>
                        <div className="space-y-1">
                          <Skeleton className="h-4 w-16" />
                          <Skeleton className="h-4 w-full" />
                        </div>
                        <div className="space-y-1">
                          <Skeleton className="h-4 w-10" />
                          <Skeleton className="h-4 w-full" />
                        </div>
                        <div className="space-y-1">
                          <Skeleton className="h-4 w-20" />
                          <Skeleton className="h-4 w-full" />
                        </div>
                        <div className="space-y-1">
                          <Skeleton className="h-4 w-12" />
                          <Skeleton className="h-4 w-full" />
                        </div>
                        <div className="space-y-1">
                          <Skeleton className="h-4 w-20" />
                          <Skeleton className="h-4 w-full" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Synopsis skeleton */}
                <div className="pt-3">
                  <Skeleton className="mb-2 h-5 w-20" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right section - Reservation details skeleton */}
          <div className="flex flex-col">
            <h2 className="text-berkeley-blue mb-6 text-xl font-semibold">
              Detalles de la Reserva
            </h2>

            <Card className="flex-1 shadow-sm">
              <CardContent className="flex h-full flex-col space-y-3">
                {/* Loan period skeleton */}
                <Skeleton className="h-14 w-full rounded-lg" />

                {/* Dates skeleton */}
                <div className="space-y-1.5">
                  <div>
                    <Skeleton className="mb-0.5 h-4 w-16" />
                    <Skeleton className="h-16 w-full rounded-lg" />
                  </div>
                  <div>
                    <Skeleton className="mb-0.5 h-4 w-16" />
                    <Skeleton className="h-16 w-full rounded-lg" />
                  </div>
                </div>

                {/* Information box skeleton */}
                <Skeleton className="h-20 w-full rounded-lg" />

                {/* Checkbox skeleton */}
                <Skeleton className="h-6 w-full" />

                {/* Pickup information skeleton */}
                <Skeleton className="h-20 w-full rounded-lg" />

                {/* Confirm button skeleton */}
                <div className="mt-auto pt-1">
                  <Skeleton className="h-9 w-full rounded-lg" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Recommended books skeleton */}
        <div className="mt-12">
          <h2 className="text-berkeley-blue mb-6 text-xl font-semibold">
            Podría interesarte...
          </h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <BookCardSkeleton />
            <BookCardSkeleton />
          </div>
        </div>
      </main>
    </div>
  );
}
