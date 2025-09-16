import { randomUUID } from "crypto";
import { buildLoansById } from "./loans";

export function buildPenaltyByIdResponse(): Record<string, unknown> {
  return {
    id: randomUUID(),
    userId: randomUUID(),
    motive: "LOANS_EXPIRED",
    amount: 100,
    status: "PENDING",
    startDate: new Date().toISOString(),
    endDate: new Date().toISOString(),
    loans: buildLoansById(),
    createdAt: new Date().toISOString(),
  };
}

export function buildPenaltyListResponse(): Record<string, unknown> {
  return {
    results: [
      {
        id: randomUUID(),
        userId: randomUUID(),
        motive: "LOANS_EXPIRED",
        amount: 100,
        status: "PENDING",
        startDate: new Date().toISOString(),
        endDate: new Date().toISOString(),
        loans: buildLoansById(),
        createdAt: new Date().toISOString(),
      },
      {
        id: randomUUID(),
        userId: randomUUID(),
        motive: "LOANS_LIMIT_REACHED",
        status: "PAID",
        createdAt: new Date().toISOString(),
      },
    ],
    total: 2,
    page: 1,
    limit: 10,
  };
}
