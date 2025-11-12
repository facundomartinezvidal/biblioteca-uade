import { count, eq } from "drizzle-orm";

import { createTRPCRouter } from "../trpc";
import { adminProcedure } from "../procedures/admin";
import {
  authors,
  books,
  genders,
  loans,
  penalties,
  roles,
  users,
} from "~/server/db/schemas";

export const dashboardRouter = createTRPCRouter({
  getAdminOverview: adminProcedure.query(async ({ ctx }) => {
    const [
      bookStatusCounts,
      loanStatusCounts,
      penaltyStatusCounts,
      studentCountResult,
      authorCountResult,
      loansCreatedAtResult,
      genreCountsRaw,
    ] = await Promise.all([
      ctx.db
        .select({
          status: books.status,
          count: count(),
        })
        .from(books)
        .groupBy(books.status),
      ctx.db
        .select({
          status: loans.status,
          count: count(),
        })
        .from(loans)
        .groupBy(loans.status),
      ctx.db
        .select({
          status: penalties.status,
          count: count(),
        })
        .from(penalties)
        .groupBy(penalties.status),
      ctx.db
        .select({ count: count() })
        .from(users)
        .innerJoin(roles, eq(users.id_rol, roles.id_rol))
        .where(eq(roles.nombre_rol, "estudiante")),
      ctx.db.select({ count: count() }).from(authors),
      ctx.db.select({ createdAt: loans.createdAt }).from(loans),
      ctx.db
        .select({
          genreId: genders.id,
          genreName: genders.name,
          count: count(),
        })
        .from(loans)
        .leftJoin(books, eq(loans.bookId, books.id))
        .leftJoin(genders, eq(books.genderId, genders.id))
        .groupBy(genders.id, genders.name),
    ]);

    const toRecord = <T extends string>(
      items: { status: T; count: number | null }[],
    ) =>
      items.reduce<Record<T, number>>(
        (acc, item) => {
          acc[item.status] = Number(item.count ?? 0);
          return acc;
        },
        {} as Record<T, number>,
      );

    const bookStatusRecord = toRecord(bookStatusCounts);
    const loanStatusRecord = toRecord(loanStatusCounts);
    const penaltyStatusRecord = toRecord(penaltyStatusCounts);

    const summary = {
      totalBooks: Object.values(bookStatusRecord).reduce(
        (acc, value) => acc + value,
        0,
      ),
      availableBooks: bookStatusRecord.AVAILABLE ?? 0,
      reservedBooks: bookStatusRecord.RESERVED ?? 0,
      notAvailableBooks: bookStatusRecord.NOT_AVAILABLE ?? 0,
      activeLoans: loanStatusRecord.ACTIVE ?? 0,
      reservedLoans: loanStatusRecord.RESERVED ?? 0,
      overdueLoans: loanStatusRecord.EXPIRED ?? 0,
      pendingPenalties:
        (penaltyStatusRecord.PENDING ?? 0) + (penaltyStatusRecord.EXPIRED ?? 0),
      totalStudents: Number(studentCountResult[0]?.count ?? 0),
      totalAuthors: Number(authorCountResult[0]?.count ?? 0),
    };

    const now = new Date();
    const monthKeys = Array.from({ length: 6 }, (_, index) => {
      const date = new Date(now.getFullYear(), now.getMonth() - (5 - index), 1);
      const key = `${date.getFullYear()}-${date.getMonth()}`;
      const formatter = new Intl.DateTimeFormat("es-AR", { month: "short" });
      const label = formatter.format(date);
      return {
        key,
        label: label.charAt(0).toUpperCase() + label.slice(1),
      };
    });

    const loansPerMonthMap = new Map<string, number>();

    for (const loan of loansCreatedAtResult) {
      const createdAt = new Date(loan.createdAt);
      if (Number.isNaN(createdAt.getTime())) continue;

      const key = `${createdAt.getFullYear()}-${createdAt.getMonth()}`;
      const oldestKey = monthKeys[0]?.key;

      if (!oldestKey) continue;

      const [oldestYear, oldestMonth] = oldestKey
        .split("-")
        .map((value) => Number.parseInt(value, 10));

      if (oldestYear === undefined || oldestMonth === undefined) continue;

      const oldestDate = new Date(oldestYear, oldestMonth, 1);
      const firstDayOfKey = new Date(
        createdAt.getFullYear(),
        createdAt.getMonth(),
        1,
      );

      if (firstDayOfKey < oldestDate) continue;

      loansPerMonthMap.set(key, (loansPerMonthMap.get(key) ?? 0) + 1);
    }

    const loansByMonth = monthKeys.map(({ key, label }) => ({
      month: label,
      count: loansPerMonthMap.get(key) ?? 0,
    }));

    const loanStatusLabels: Record<keyof typeof loanStatusRecord, string> = {
      RESERVED: "Reservas",
      ACTIVE: "Activos",
      FINISHED: "Finalizados",
      EXPIRED: "Vencidos",
      CANCELLED: "Cancelados",
    };

    const loansByStatus = (
      Object.keys(loanStatusLabels) as Array<keyof typeof loanStatusLabels>
    ).map((status) => ({
      status,
      label: loanStatusLabels[status],
      count: loanStatusRecord[status] ?? 0,
    }));

    const genreDistribution = genreCountsRaw
      .filter((item) => !!item.genreName)
      .map((item) => ({
        genre: item.genreName ?? "Sin género",
        count: Number(item.count ?? 0),
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    return {
      summary,
      charts: {
        loansByMonth,
        loansByStatus,
        genreDistribution,
      },
    };
  }),
});
