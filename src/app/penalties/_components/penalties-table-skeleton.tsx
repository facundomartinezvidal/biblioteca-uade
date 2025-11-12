import { Card, CardContent } from "~/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { Skeleton } from "~/components/ui/skeleton";

type PenaltiesTableSkeletonProps = {
  showActions?: boolean;
};

export default function PenaltiesTableSkeleton({
  showActions = true,
}: PenaltiesTableSkeletonProps) {
  return (
    <Card className="shadow-sm">
      <CardContent className="px-6 py-4">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID Préstamo</TableHead>
                <TableHead>Libro</TableHead>
                <TableHead>Sanción</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="min-w-[120px]">Creada</TableHead>
                <TableHead className="min-w-[120px]">Vence</TableHead>
                <TableHead className="min-w-[120px]">Monto</TableHead>
                {showActions && (
                  <TableHead className="w-[80px] text-right">
                    Acciones
                  </TableHead>
                )}
              </TableRow>
            </TableHeader>
            <TableBody>
              {Array.from({ length: 5 }).map((_, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <Skeleton className="h-4 w-20" />
                  </TableCell>

                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Skeleton className="h-14 w-10 flex-shrink-0 rounded" />
                      <div className="min-w-0 space-y-2">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-3 w-24" />
                      </div>
                    </div>
                  </TableCell>

                  <TableCell>
                    <Skeleton className="h-4 w-28" />
                  </TableCell>

                  <TableCell>
                    <Skeleton className="h-6 w-20 rounded-full" />
                  </TableCell>

                  <TableCell>
                    <Skeleton className="h-4 w-20" />
                  </TableCell>

                  <TableCell>
                    <Skeleton className="h-4 w-20" />
                  </TableCell>

                  <TableCell>
                    <Skeleton className="h-4 w-16" />
                  </TableCell>

                  {showActions && (
                    <TableCell className="w-[80px] text-right">
                      <Skeleton className="ml-auto h-8 w-8 rounded" />
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
