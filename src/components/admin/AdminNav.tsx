"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";

const links = [
  { href: "/admin", label: "Métricas" },
  { href: "/admin/noticias", label: "Noticias" },
  { href: "/admin/categorias", label: "Categorías" },
  { href: "/admin/comentarios", label: "Comentarios" },
  { href: "/admin/usuarios", label: "Usuarios" },
];

export function AdminNav() {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <nav className="flex items-center justify-between border-b border-border bg-white px-4 py-3 sm:px-6">
      <div className="flex flex-wrap items-center gap-1">
        {links.map((link) => {
          const active =
            link.href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`rounded-md px-3 py-2 text-sm font-medium focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${
                active
                  ? "bg-primary text-primary-foreground"
                  : "text-foreground hover:bg-muted-bg"
              }`}
            >
              {link.label}
            </Link>
          );
        })}
      </div>
      <div className="flex items-center gap-2">
        <Link
          href="/noticias"
          target="_blank"
          className="rounded-md px-3 py-2 text-sm font-medium text-foreground hover:bg-muted-bg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          Ver sitio
        </Link>
        <Button variant="secondary" onClick={handleLogout}>
          Cerrar sesión
        </Button>
      </div>
    </nav>
  );
}
