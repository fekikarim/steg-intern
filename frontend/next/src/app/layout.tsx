import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";
import { getCurrentUser } from "@/lib/session";
import { LogoutButton } from "@/components/logout-button";

export const metadata: Metadata = {
  title: {
    default: "STEG — Stage Portal",
    template: "%s | STEG",
  },
  description:
    "Plateforme de candidature et de gestion des stages de la Société Tunisienne de l'Électricité et du Gaz (STEG).",
};

async function Nav() {
  const user = await getCurrentUser();
  return (
    <header className="border-b border-border bg-card">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded bg-steg text-sm font-bold text-white">
            S
          </span>
          <span className="text-lg font-bold text-steg">STEG</span>
          <span className="hidden text-sm text-muted sm:inline">Stage Portal</span>
        </Link>
        <div className="flex items-center gap-4">
          {user ? (
            <>
              <Link href="/dashboard" className="text-sm font-medium hover:text-steg">
                Dashboard
              </Link>
              <Link href="/applications" className="text-sm font-medium hover:text-steg">
                Mes candidatures
              </Link>
              <Link href="/profile" className="text-sm font-medium hover:text-steg">
                Profil
              </Link>
              <LogoutButton>{user.email}</LogoutButton>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="rounded-md border border-border px-4 py-2 text-sm font-medium hover:bg-gray-50"
              >
                Connexion
              </Link>
              <Link href="/register" className="btn-primary">
                Candidater
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr">
      <body className="flex min-h-screen flex-col">
        <Nav />
        <main className="flex-1">{children}</main>
        <footer className="border-t border-border bg-card">
          <div className="mx-auto max-w-6xl px-4 py-6 text-center text-sm text-muted">
            © {new Date().getFullYear()} STEG — Société Tunisienne de l’Électricité et du Gaz. Tous
            droits réservés.
          </div>
        </footer>
      </body>
    </html>
  );
}
