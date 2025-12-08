"use client";

import {
  createContext,
  useContext,
  type ReactNode,
  useEffect,
  useState,
} from "react";
import { api } from "~/trpc/react";

export interface UserData {
  id: string;
  name: string | null;
  last_name: string | null;
  email: string | null;
  phone: string | null;
  identity_card: string | null;
  career: string | null;
  rol: string | null;
  subrol: string | null;
  description: string | null;
  subcategory: string | null;
  base_salary: string | null;
  status: boolean | null;
}

export interface UserContextType {
  user: UserData | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  refetch: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [isClient, setIsClient] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const { data, isLoading, refetch } = api.auth.getUser.useQuery(undefined, {
    enabled: isClient,
    retry: 0,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    staleTime: 120000, // 2 minutes
  });

  useEffect(() => {
    if (isClient && !isLoading) {
      setIsInitializing(false);
    }
  }, [isClient, isLoading]);

  const value: UserContextType = {
    user: data?.user ?? null,
    isLoading: isLoading || isInitializing,
    isAuthenticated: !!data?.user,
    refetch: () => void refetch(),
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}
