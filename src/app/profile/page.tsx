"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "~/trpc/react";
import { ProfileHeader } from "./_components/profile-header";
import { StatsGrid } from "./_components/stats-grid";
import { LoansTable } from "./_components/loans-table";
import { ComingSoon } from "../_components/coming-soon";
import { Settings } from "lucide-react";
import { ProfileHeaderSkeleton } from "./_components/profile-header-skeleton";
import { StatsGridSkeleton } from "./_components/stats-grid-skeleton";
import { LoansTableSkeleton } from "./_components/loans-table-skeleton";
import LoanDetailsPopup from "../loans/_components/loan-details-popup";
import CancelReservationModal from "../loans/_components/cancel-reservation-modal";

type LoanStatus = "RESERVED" | "ACTIVE" | "FINISHED" | "EXPIRED" | "CANCELLED";

interface LoanItem {
  id: string;
  userId: string;
  endDate: string;
  status: LoanStatus;
  createdAt: string;
  book: {
    id: string;
    title: string;
    description: string | null;
    isbn: string | null;
    status: string | null;
    year: number | null;
    imageUrl: string | null;
    createdAt: string;
    editorial: string;
  };
  author: {
    id: string;
    name: string;
    middleName: string | null;
    lastName: string | null;
    createdAt: string;
  } | null;
  gender: {
    id: string;
    name: string;
    createdAt: string;
  } | null;
  location: {
    id: string;
    address: string;
    campus: string;
  } | null;
  editorial: string | null;
}

export default function ProfilePage() {
  const router = useRouter();
  const utils = api.useUtils();
  const { data: user, isLoading: isLoadingUser } = api.user.getUser.useQuery();
  const { data: stats, isLoading: isLoadingStats } =
    api.loans.getStats.useQuery(undefined, {
      enabled: user?.role === "estudiante",
    });
  const {
    data: activeLoansData,
    isLoading: isLoadingLoans,
    refetch,
  } = api.loans.getByUserId.useQuery(
    { page: 1, limit: 100 },
    {
      enabled: user?.role === "estudiante",
    },
  );

  const [selectedLoan, setSelectedLoan] = useState<LoanItem | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [loanToCancel, setLoanToCancel] = useState<{
    id: string;
    title: string;
  } | null>(null);

  const cancelMutation = api.loans.cancelReservation.useMutation({
    onSuccess: async () => {
      await refetch();
      await utils.books.getAll.invalidate();
      await utils.books.getById.invalidate();
      await utils.loans.getStats.invalidate();
      setIsCancelModalOpen(false);
      setLoanToCancel(null);
    },
  });

  const handleViewMore = (loan: LoanItem) => {
    setSelectedLoan(loan);
    setIsDetailsOpen(true);
  };

  const handleOpenCancelModal = (loanId: string, bookTitle: string) => {
    setLoanToCancel({ id: loanId, title: bookTitle });
    setIsCancelModalOpen(true);
  };

  const handleConfirmCancel = () => {
    if (loanToCancel) {
      cancelMutation.mutate({ loanId: loanToCancel.id });
    }
  };

  const handleReserveAgain = (bookId: string) => {
    router.push(`/reserve/${bookId}`);
  };

  const activeLoans =
    activeLoansData?.results.filter(
      (loan) => loan.status === "ACTIVE" || loan.status === "RESERVED",
    ) ?? [];

  if (isLoadingUser) {
    return (
      <div className="min-h-screen bg-white">
        <div className="container mx-auto px-8 py-8">
          <div className="flex flex-col gap-6">
            <ProfileHeaderSkeleton />
            <StatsGridSkeleton />
            <div className="flex flex-col gap-4">
              <div className="h-6 w-48 animate-pulse rounded-md bg-gray-200" />
              <LoansTableSkeleton />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-8 py-8">
        <div className="flex flex-col gap-6">
          <ProfileHeader
            name={user?.name ?? ""}
            last_name={user?.last_name ?? ""}
            institutional_email={user?.institutional_email ?? ""}
            personal_email={user?.personal_email ?? ""}
            phone={user?.phone ?? ""}
            identity_card={user?.identity_card ?? ""}
            legacy_number={user?.legacy_number ?? ""}
            role={user?.role ?? ""}
          />

          {user?.role === "admin" && (
            <div className="flex items-center justify-center py-12">
              <ComingSoon
                title="Dashboard de administrador"
                description="Estamos trabajando en esta sección. Pronto podrás ver estadísticas y gestionar el sistema desde aquí."
                icon={<Settings className="h-6 w-6" />}
              />
            </div>
          )}

          {user?.role === "estudiante" && (
            <>
              {isLoadingStats ? (
                <StatsGridSkeleton />
              ) : (
                <StatsGrid
                  activeLoans={stats?.activeLoans ?? 0}
                  finishedLoans={stats?.finishedLoans ?? 0}
                  pendingFines={stats?.pendingFines ?? 0}
                  upcomingDue={stats?.upcomingDue ?? 0}
                />
              )}

              <div className="flex flex-col gap-4">
                <h2 className="text-lg font-semibold text-gray-900">
                  Préstamos activos
                </h2>
                {isLoadingLoans ? (
                  <LoansTableSkeleton />
                ) : (
                  <LoansTable
                    loans={activeLoans}
                    onViewMore={handleViewMore}
                    onCancel={handleOpenCancelModal}
                    onReserve={handleReserveAgain}
                    isLoadingCancel={cancelMutation.isPending}
                    isLoadingReserve={false}
                  />
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {selectedLoan && (
        <LoanDetailsPopup
          loan={selectedLoan}
          isOpen={isDetailsOpen}
          onClose={() => setIsDetailsOpen(false)}
          onCancel={handleOpenCancelModal}
          onReserve={handleReserveAgain}
          isLoadingCancel={cancelMutation.isPending}
          isLoadingReserve={false}
        />
      )}

      <CancelReservationModal
        isOpen={isCancelModalOpen}
        onClose={() => setIsCancelModalOpen(false)}
        bookTitle={loanToCancel?.title ?? ""}
        onConfirm={handleConfirmCancel}
        isLoading={cancelMutation.isPending}
      />
    </div>
  );
}
