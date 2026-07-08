import type { Metadata } from "next";
import "../globals.css";
import { fontVariables } from "@/lib/fonts";

/**
 * Root-Layout des Admin-Bereichs. Bewusst getrennt vom öffentlichen Root-Layout
 * (app/(site)/[locale]), damit der Admin einsprachig Deutsch bleibt (`lang="de"`),
 * während die öffentliche Website mehrsprachig ist. Das innere Admin-Chrome
 * (Navigation, Hintergrund) liegt in app/(admin)/admin/(app)/layout.tsx.
 */
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de" className={`${fontVariables} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-creme text-tinte">{children}</body>
    </html>
  );
}
