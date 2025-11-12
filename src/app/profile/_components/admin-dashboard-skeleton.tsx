import { Skeleton } from "~/components/ui/skeleton";

export function AdminDashboardSkeleton() {
  return (
    <div className="flex flex-col gap-6">
      <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 9 }).map((_, index) => (
          <div
            key={index}
            className="rounded-md bg-slate-50 p-4 shadow-sm shadow-slate-100"
          >
            <Skeleton className="mb-2 h-4 w-32" />
            <Skeleton className="mb-2 h-10 w-24" />
            <Skeleton className="h-3 w-20" />
          </div>
        ))}
      </section>

      <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {Array.from({ length: 2 }).map((_, index) => (
          <div
            key={`chart-${index}`}
            className="rounded-lg border border-berkeley-blue/10 bg-white p-6"
          >
            <Skeleton className="mb-4 h-6 w-64" />
            <Skeleton className="h-[240px] w-full" />
          </div>
        ))}
      </section>

      <section>
        <div className="rounded-lg border border-berkeley-blue/10 bg-white p-6">
          <Skeleton className="mb-4 h-6 w-64" />
          <div className="flex flex-col gap-4 lg:flex-row">
            <Skeleton className="h-56 w-full max-w-[320px]" />
            <div className="grid w-full max-w-sm gap-2">
              {Array.from({ length: 5 }).map((_, index) => (
                <Skeleton key={`legend-${index}`} className="h-10 w-full" />
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}


