import "~/styles/globals.css";

import { type Metadata } from "next";
import { Geist } from "next/font/google";

import { TRPCReactProvider } from "~/trpc/react";
import AppNavbar from "./_components/app-navbar";
import { Footer } from "./_components/footer";

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
      <body className="flex min-h-screen flex-col">
        <TRPCReactProvider>
          <AppNavbar />
          <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">{children}</main>
          <Footer />
        </TRPCReactProvider>
      </body>
    </html>
  );
}
