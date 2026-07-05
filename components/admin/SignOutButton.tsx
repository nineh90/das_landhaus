import { signOut } from "@/lib/auth";

/**
 * Abmelde-Button — nutzt eine Inline-Server-Action, damit kein Client-JS nötig ist.
 */
export default function SignOutButton() {
  return (
    <form
      action={async () => {
        "use server";
        await signOut({ redirectTo: "/admin/login" });
      }}
    >
      <button
        type="submit"
        className="rounded-full border border-creme/30 px-4 py-2 text-sm font-semibold text-creme/90 transition-colors hover:bg-creme/10"
      >
        Abmelden
      </button>
    </form>
  );
}
