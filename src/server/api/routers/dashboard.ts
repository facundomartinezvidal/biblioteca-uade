import { count, eq, gte, sql } from "drizzle-orm";

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
    // Calculate date range for last 6 months
    const now = new Date();
    const sixMonthsAgo = new Date(
      now.getFullYear(),
      now.getMonth() - 5,
      1,
      0,
      0,
      0,
      0,
    );

    // Execute queries sequentially for better error tracking
    const bookStatusCounts = await ctx.db
      .select({
        status: books.status,
        count: count(),
      })
      .from(books)
      .groupBy(books.status);

    const loanStatusCounts = await ctx.db
      .select({
        status: loans.status,
        count: count(),
      })
      .from(loans)
      .groupBy(loans.status);

    const penaltyStatusCounts = await ctx.db
      .select({
        status: penalties.status,
        count: count(),
      })
      .from(penalties)
      .groupBy(penalties.status);

    // Student count is no longer available from local DB
    // Would need to fetch from backoffice API if needed
    const studentCountResult = [{ count: 0 }];

    const authorCountResult = await ctx.db
      .select({ count: count() })
      .from(authors);

    const genreCountsRaw = await ctx.db
      .select({
        genreName: genders.name,
        count: count(),
      })
      .from(loans)
      .leftJoin(books, eq(loans.bookId, books.id))
      .leftJoin(genders, eq(books.genderId, genders.id))
      .where(sql`${genders.name} IS NOT NULL`)
      .groupBy(genders.name)
      .orderBy(sql`COUNT(*) DESC`)
      .limit(5);

    // Process book status
    const bookStatusRecord = bookStatusCounts.reduce<Record<string, number>>(
      (acc, item) => {
        acc[item.status] = Number(item.count ?? 0);
        return acc;
      },
      {},
    );

    // Process loan status
    const loanStatusRecord = loanStatusCounts.reduce<Record<string, number>>(
      (acc, item) => {
        acc[item.status] = Number(item.count ?? 0);
        return acc;
      },
      {},
    );

    // Process penalty status
    const penaltyStatusRecord = penaltyStatusCounts.reduce<
      Record<string, number>
    >((acc, item) => {
      acc[item.status] = Number(item.count ?? 0);
      return acc;
    }, {});

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

    // Generate month keys for the chart
    const currentDate = new Date();
    const monthKeys = Array.from({ length: 6 }, (_, index) => {
      const date = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() - (5 - index),
        1,
      );
      const monthNum = date.getMonth() + 1; // SQL months are 1-based
      const year = date.getFullYear();
      const key = `${year}-${monthNum.toString().padStart(2, "0")}`;
      const formatter = new Intl.DateTimeFormat("es-AR", { month: "short" });
      const label = formatter.format(date);
      return {
        key,
        year,
        month: monthNum,
        label: label.charAt(0).toUpperCase() + label.slice(1),
      };
    });

    // OPTIMIZED: Use substring on text field instead of EXTRACT on timestamp
    // This is much faster since created_at is stored as text (ISO string)
    const loansPerMonthResults = await ctx.db
      .select({
        yearMonth: sql<string>`SUBSTRING(${loans.createdAt}, 1, 7)`, // Gets "YYYY-MM" from ISO string
        count: count(),
      })
      .from(loans)
      .where(gte(loans.createdAt, sixMonthsAgo.toISOString()))
      .groupBy(sql`SUBSTRING(${loans.createdAt}, 1, 7)`);

    // Create a map for quick lookup
    const loansPerMonthMap = new Map<string, number>();
    for (const result of loansPerMonthResults) {
      loansPerMonthMap.set(result.yearMonth, Number(result.count ?? 0));
    }

    // Map the results to the month keys
    const loansByMonth = monthKeys.map(({ key, label }) => ({
      month: label,
      count: loansPerMonthMap.get(key) ?? 0,
    }));

    const loanStatusLabels: Record<string, string> = {
      RESERVED: "Reservas",
      ACTIVE: "Activos",
      FINISHED: "Finalizados",
      EXPIRED: "Vencidos",
      CANCELLED: "Cancelados",
    };

    const loansByStatus = Object.keys(loanStatusLabels).map((status) => ({
      status,
      label: loanStatusLabels[status]!,
      count: loanStatusRecord[status] ?? 0,
    }));

    const genreDistribution = genreCountsRaw.map((item) => ({
      genre: item.genreName ?? "Sin género",
      count: Number(item.count ?? 0),
    }));

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
