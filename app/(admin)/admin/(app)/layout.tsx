import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { auth } from "@/lib/auth";
import AdminNav from "@/components/admin/AdminNav";
import SignOutButton from "@/components/admin/SignOutButton";
import AdminToastProvider from "@/components/admin/Toast";

export const metadata: Metadata = {
  title: { default: "Admin", template: "%s | Admin — Das Landhaus" },
  robots: { index: false, follow: false },
};

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  return (
    <div className="relative isolate min-h-full w-full">
      {/* Landhaus als seitenweiter, ruhiger Hintergrund — fixiert, mit hellem
          Creme-Schleier, damit Karten & Text voll lesbar bleiben. */}
      <div className="fixed inset-0 -z-10">
        <Image
          src="/images/hero/landhaus-hero.jpeg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-creme/85" />
      </div>

      <header className="bg-wald-dark/85 text-creme shadow-md backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 pt-4">
          <Link href="/admin" className="font-display text-lg text-creme">
            Das Landhaus <span className="text-creme/50">· Admin</span>
          </Link>
          <div className="flex items-center gap-3">
            {session?.user?.email && (
              <span className="hidden text-sm text-creme/70 sm:inline">{session.user.email}</span>
            )}
            <SignOutButton />
          </div>
        </div>
        <div className="mx-auto max-w-6xl px-4 pb-3 pt-3">
          <AdminNav />
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8">
        <Suspense fallback={null}>
          <AdminToastProvider>{children}</AdminToastProvider>
        </Suspense>
      </main>
    </div>
  );
}
