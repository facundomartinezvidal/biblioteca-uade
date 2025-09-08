import StackCard from "./_components/stack-card";
import PostsDemo from "./_components/posts-demo";
import { GitHubIcon } from "~/components/icons/icons/github-icon";
import { NextJSIcon } from "~/components/icons/icons/nextjs-icon";
import { TRPCIcon } from "~/components/icons/icons/trpc-icon";
import { SupabaseIcon } from "~/components/icons/icons/supabase-icon";
import { DrizzleIcon } from "~/components/icons/icons/drizzle-icon";
import { TypeScriptIcon } from "~/components/icons/icons/typescript-icon";
import { TailwindIcon } from "~/components/icons/icons/tailwind-icon";
import { Zap, Shield, Database } from "lucide-react";
import DeveloperSection from "./_components/developer-section";
import Link from "next/link";

export default async function HomePage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%239C92AC%22%20fill-opacity%3D%220.1%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%221%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-50" />
      <div className="absolute top-0 left-0 h-full w-full bg-gradient-to-br from-blue-500/10 via-blue-600/10 to-blue-700/10" />

      <div className="relative z-10 container mx-auto px-4 py-20">
        {/* Hero Section */}
        <div className="mb-20 text-center">
          <div className="mb-6">
            <span className="inline-flex items-center rounded-full border border-blue-400/30 bg-blue-500/20 px-4 py-2 text-sm font-medium text-blue-100 backdrop-blur-sm">
              <Zap className="mr-2 h-4 w-4 text-blue-300" />
              Production Ready Template
            </span>
          </div>

          <h1 className="mb-8 text-5xl leading-tight font-bold text-white md:text-7xl">
            Full Stack Template
            <span className="mt-2 block bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 bg-clip-text text-transparent">
              Type-Safe & Modern
            </span>
          </h1>

          <p className="mx-auto mb-12 max-w-3xl text-xl leading-relaxed text-white/70">
            Enterprise-grade Next.js template with tRPC for type-safe APIs,
            Supabase for backend services, and Drizzle ORM for database
            operations. Built with TypeScript and Tailwind CSS.
          </p>

          <div className="mx-auto mt-4 flex max-w-2xl flex-col items-center justify-center gap-3">
            <p className="text-white/60">
              Clone it or start from this template to build your next app.
            </p>
            <div className="flex flex-col items-center gap-3 sm:flex-row">
              <Link
                href="https://github.com/facundomartinezvidal/next-trpc-drizzle-supabase"
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-2 rounded-lg border border-white/20 bg-white/10 px-5 py-3 text-white transition-all hover:scale-[1.02] hover:border-white/30 hover:bg-white/15"
              >
                <GitHubIcon className="h-5 w-5 transition-transform group-hover:scale-110" />
                <span>View Repository</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="mx-auto mb-20 grid max-w-7xl gap-8 md:grid-cols-2 lg:grid-cols-3">
          <StackCard
            title="Next.js"
            content="React framework for production with server-side rendering, static generation, and edge computing capabilities."
            icon={<NextJSIcon size={28} className="text-white" />}
            website="https://nextjs.org"
            color="bg-black/30"
            gradient="bg-gradient-to-br from-black to-gray-800"
          />

          <StackCard
            title="tRPC"
            content="End-to-end typesafe APIs with automatic TypeScript inference and seamless client-server communication."
            icon={<TRPCIcon size={28} />}
            website="https://trpc.io"
            color="bg-blue-500/20"
            gradient="bg-gradient-to-br from-blue-500 to-blue-700"
          />

          <StackCard
            title="Supabase"
            content="Open source Firebase alternative with PostgreSQL database, authentication, and real-time subscriptions."
            icon={<SupabaseIcon size={28} />}
            website="https://supabase.com"
            color="bg-green-500/20"
            gradient="bg-gradient-to-br from-green-500 to-emerald-600"
          />

          <StackCard
            title="Drizzle ORM"
            content="TypeScript-first ORM with zero-runtime overhead, SQL-like syntax, and excellent developer experience."
            icon={<DrizzleIcon size={28} />}
            website="https://orm.drizzle.team"
            color="bg-yellow-500/20"
            gradient="bg-gradient-to-br from-yellow-400 to-yellow-600"
          />

          <StackCard
            title="TypeScript"
            content="Static type checking for JavaScript with enhanced developer productivity and runtime error prevention."
            icon={<TypeScriptIcon size={28} />}
            website="https://typescriptlang.org"
            color="bg-blue-600/20"
            gradient="bg-gradient-to-br from-blue-600 to-blue-800"
          />

          <StackCard
            title="Tailwind CSS"
            content="Utility-first CSS framework for rapid UI development with modern design patterns and responsive layouts."
            icon={<TailwindIcon size={28} />}
            website="https://tailwindcss.com"
            color="bg-cyan-500/20"
            gradient="bg-gradient-to-br from-cyan-400 to-teal-500"
          />
        </div>

        {/* Features Highlights */}
        <div className="mx-auto mb-20 grid max-w-5xl gap-8 md:grid-cols-3">
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-sm">
              <Shield className="h-8 w-8 text-blue-400" />
            </div>
            <h3 className="mb-3 text-xl font-bold text-white">Type Safety</h3>
            <p className="text-white/70">
              End-to-end type safety from database to frontend with TypeScript
              and tRPC.
            </p>
          </div>

          <div className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-sm">
              <Database className="h-8 w-8 text-blue-500" />
            </div>
            <h3 className="mb-3 text-xl font-bold text-white">
              Database Ready
            </h3>
            <p className="text-white/70">
              PostgreSQL with Drizzle ORM for type-safe database operations and
              migrations.
            </p>
          </div>

          <div className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-sm">
              <Zap className="h-8 w-8 text-blue-300" />
            </div>
            <h3 className="mb-3 text-xl font-bold text-white">
              Production Ready
            </h3>
            <p className="text-white/70">
              Optimized performance, SEO, and deployment configurations for
              enterprise use.
            </p>
          </div>
        </div>

        {/* tRPC Demo Section */}
        <div className="mb-20">
          <PostsDemo />
        </div>

        {/* Developer Section */}
        <DeveloperSection />
      </div>
    </div>
  );
}
