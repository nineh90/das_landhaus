import type { Metadata } from "next";
import Image from "next/image";
import Ornament from "@/components/ui/Ornament";
import LoginFormular from "./LoginFormular";

export const metadata: Metadata = {
  title: "Admin-Login",
  robots: { index: false, follow: false },
};

export default function LoginSeite() {
  return (
    <div className="relative flex min-h-screen items-center justify-center px-4 py-12">
      {/* Markenbild + Abdunklung als Hintergrund */}
      <Image
        src="/images/hero/landhaus-hero.jpeg"
        alt=""
        fill
        priority
        sizes="100vw"
        className="-z-10 object-cover"
      />
      <div className="absolute inset-0 -z-10 bg-wald-dark/85" />

      <div className="w-full max-w-sm rounded-2xl bg-creme p-8 shadow-2xl ring-1 ring-black/5">
        <h1 className="text-center font-script text-4xl font-bold text-wald-dark">Das Landhaus</h1>
        <Ornament className="mt-3 text-akzent/40" />
        <p className="mb-6 mt-3 text-center text-sm text-tinte/60">
          Admin-Bereich — bitte anmelden.
        </p>
        <LoginFormular />
      </div>
    </div>
  );
}
