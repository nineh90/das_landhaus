import Header from "@/components/ui/Header";
import Footer from "@/components/ui/Footer";

/**
 * Layout der öffentlichen Website: Header + Inhalt + Footer.
 * Der Admin-Bereich (app/admin) liegt bewusst außerhalb dieser Gruppe und bringt
 * sein eigenes Chrome mit.
 */
export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  );
}
