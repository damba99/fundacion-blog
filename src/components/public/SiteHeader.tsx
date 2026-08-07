import Link from "next/link";
import { isAdminSession } from "@/lib/auth";

export async function SiteHeader() {
  const isAdmin = await isAdminSession();

  return (
    <header className="border-b border-border bg-white">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4 sm:px-6">
        <Link
          href="/"
          className="text-lg font-bold text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          Fundación Noticias
        </Link>
        <nav className="flex items-center gap-6 text-sm font-medium">
          <Link
            href="/"
            className="text-foreground hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            Inicio
          </Link>
          <Link
            href="/noticias"
            className="text-foreground hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            Noticias
          </Link>
          {isAdmin && (
            <Link
              href="/admin"
              className="rounded-md bg-primary px-3 py-1.5 text-primary-foreground hover:bg-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              Panel admin
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
