import { randomUUID } from "crypto";
import { buildLoansById } from "./loans";
import { buildPenaltyByIdResponse } from "./penalty";

export function buildNotificationsList(): Record<string, unknown> {
  return {
    results: [
      {
        id: randomUUID(),
        type: "LOANS_DEADLINE",
        loans: buildLoansById(),
        createdAt: new Date().toISOString(),
      },
      {
        id: randomUUID(),
        type: "LOANS_EXPIRED",
        loans: buildLoansById(),
        createdAt: new Date().toISOString(),
      },
      {
        id: randomUUID(),
        type: "LOANS_LIMIT_REACHED",
        createdAt: new Date().toISOString(),
      },
      {
        id: randomUUID(),
        type: "LOANS_CANCELLED",
        loans: buildLoansById(),
        createdAt: new Date().toISOString(),
      },
      {
        id: randomUUID(),
        type: "USER_PENALIZED",
        penalty: buildPenaltyByIdResponse(),
        createdAt: new Date().toISOString(),
      },
    ],
    userId: randomUUID(),
    total: 3,
  };
}
