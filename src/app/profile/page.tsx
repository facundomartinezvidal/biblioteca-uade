"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "~/trpc/react";
import { useUser } from "~/lib/contexts";
import { ProfileHeader } from "./_components/profile-header";
import { StatsGrid } from "./_components/stats-grid";
import { LoansTable } from "./_components/loans-table";
import { ProfileHeaderSkeleton } from "./_components/profile-header-skeleton";
import { StatsGridSkeleton } from "./_components/stats-grid-skeleton";
import { LoansTableSkeleton } from "./_components/loans-table-skeleton";
import LoanDetailsPopup from "../loans/_components/loan-details-popup";
import CancelReservationModal from "../loans/_components/cancel-reservation-modal";
import { AdminDashboard } from "./_components/admin-dashboard";
import { AdminDashboardSkeleton } from "./_components/admin-dashboard-skeleton";

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
  // Use context user for basic role check
  const { user: contextUser, isLoading: isLoadingContextUser } = useUser();

  // Fetch complete user data from backoffice
  const { data: profileData, isLoading: isLoadingProfile } =
    api.user.getUser.useQuery(undefined, {
      enabled: !!contextUser,
    });

  const isLoadingUser = isLoadingContextUser || isLoadingProfile;

  const userRole = contextUser?.rol?.toUpperCase();
  const userSubrol: string | undefined = contextUser?.subrol
    ? String(contextUser.subrol).toUpperCase()
    : undefined;

  const { data: stats, isLoading: isLoadingStats } =
    api.loans.getStats.useQuery(undefined, {
      enabled: !!contextUser && userRole === "ALUMNO",
    });
  const {
    data: activeLoansData,
    isLoading: isLoadingLoans,
    refetch,
  } = api.loans.getByUserId.useQuery(
    { page: 1, limit: 100 },
    {
      enabled: !!contextUser && userRole === "ALUMNO",
    },
  );

  const {
    data: adminOverview,
    isLoading: isLoadingAdminOverview,
    refetch: refetchAdminOverview,
  } = api.dashboard.getAdminOverview.useQuery(undefined, {
    enabled:
      !!contextUser &&
      userRole === "ADMINISTRADOR" &&
      userSubrol === "BIBLIOTECARIO",
  });

  const [selectedLoan, setSelectedLoan] = useState<LoanItem | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [loanToCancel, setLoanToCancel] = useState<{
    id: string;
    title: string;
  } | null>(null);

  // Query para verificar si la cancelación aplicará multa
  const { data: penaltyCheckData, isLoading: isCheckingPenalty } =
    api.loans.checkCancellationPenalty.useQuery(
      { loanId: loanToCancel?.id ?? "" },
      { enabled: !!loanToCancel?.id },
    );

  const cancelMutation = api.loans.cancelReservation.useMutation({
    onSuccess: async () => {
      await refetch();
      await Promise.all([
        utils.books.getAll.invalidate(),
        utils.books.getById.invalidate(),
        utils.loans.getByUserId.invalidate(),
        utils.loans.getActive.invalidate(),
        utils.loans.getStats.invalidate(),
      ]);
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

  const handleViewPenalties = () => {
    router.push("/penalties");
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
            <AdminDashboardSkeleton />
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
            name={profileData?.name ?? contextUser?.name ?? ""}
            last_name={profileData?.last_name ?? contextUser?.last_name ?? ""}
            subrol={userSubrol ?? undefined}
            institutional_email={
              profileData?.institutional_email ?? contextUser?.email ?? ""
            }
            personal_email={profileData?.personal_email ?? ""}
            phone={profileData?.phone ?? ""}
            identity_card={profileData?.identity_card ?? ""}
            legacy_number={profileData?.legacy_number ?? ""}
            role={profileData?.role ?? contextUser?.rol ?? ""}
          />

          {userRole === "ADMINISTRADOR" && userSubrol === "BIBLIOTECARIO" && (
            <>
              {isLoadingAdminOverview ? (
                <AdminDashboardSkeleton />
              ) : adminOverview ? (
                <AdminDashboard data={adminOverview} />
              ) : (
                <div className="border-berkeley-blue/10 rounded-xl border bg-slate-50 p-6 text-center text-sm text-slate-600">
                  <p className="font-medium text-slate-700">
                    No pudimos cargar el dashboard del administrador.
                  </p>
                  <p className="mt-1 text-slate-500">
                    Intentalo nuevamente más tarde o refresca la página.
                  </p>
                  <button
                    type="button"
                    onClick={() => void refetchAdminOverview()}
                    className="bg-berkeley-blue hover:bg-berkeley-blue/90 mt-4 inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium text-white transition"
                  >
                    Reintentar
                  </button>
                </div>
              )}
            </>
          )}

          {userRole === "ALUMNO" && (
            <>
              {isLoadingStats ? (
                <StatsGridSkeleton />
              ) : (
                <StatsGrid
                  activeLoans={stats?.activeLoans ?? 0}
                  finishedLoans={stats?.finishedLoans ?? 0}
                  pendingFines={stats?.pendingFines ?? 0}
                  upcomingDue={stats?.upcomingDue ?? 0}
                  onPendingFinesClick={handleViewPenalties}
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
        willBePenalized={penaltyCheckData?.willBePenalized ?? false}
        isCheckingPenalty={isCheckingPenalty}
      />
    </div>
  );
}
