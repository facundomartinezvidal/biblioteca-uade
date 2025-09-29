import "~/styles/globals.css";

import { type Metadata } from "next";
import { Geist } from "next/font/google";

import { TRPCReactProvider } from "~/trpc/react";
import AppNavbar from "./_components/navbar/app-navbar";

export const metadata: Metadata = {
  title: "Biblioteca UADE",
  description:
    "Portal de la Biblioteca de la Universidad Argentina de la Empresa",
  icons: [{ rel: "icon", url: "/favicon.png" }],
};

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${geist.variable}`}>
      <body>
        <TRPCReactProvider>
          <AppNavbar />
          {children}
        </TRPCReactProvider>
      </body>
    </html>
  );
}
