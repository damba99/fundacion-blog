"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";
import type { NoticiaConCategoria } from "@/types";

export default function AdminNoticiasPage() {
  const router = useRouter();
  const [noticias, setNoticias] = useState<NoticiaConCategoria[]>([]);
  const [loading, setLoading] = useState(true);

  async function loadNoticias() {
    setLoading(true);
    const res = await fetch("/api/noticias?page=1");
    const data = await res.json();
    setNoticias(data.noticias);
    setLoading(false);
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- fetch-on-mount into local state
    loadNoticias();
  }, []);

  async function handleDelete(id: string) {
    if (!confirm("¿Eliminar esta noticia? Esta acción no se puede deshacer.")) return;
    await fetch(`/api/noticias/${id}`, { method: "DELETE" });
    loadNoticias();
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Noticias</h1>
          <p className="mt-1 text-sm text-muted">Gestioná las noticias del sitio.</p>
        </div>
        <Button onClick={() => router.push("/admin/noticias/nueva")}>
          Nueva noticia
        </Button>
      </div>

      {loading ? (
        <p className="text-sm text-muted">Cargando...</p>
      ) : noticias.length === 0 ? (
        <EmptyState title="No hay noticias creadas todavía" />
      ) : (
        <ul className="divide-y divide-border rounded-lg border border-border bg-white">
          {noticias.map((noticia) => (
            <li key={noticia.id} className="flex items-center justify-between gap-4 px-4 py-3">
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-foreground">
                  {noticia.titulo}
                </p>
                <div className="mt-1 flex flex-wrap items-center gap-2">
                  {noticia.categoria && (
                    <Badge>{noticia.categoria.nombre}</Badge>
                  )}
                  <Badge tone={noticia.publicada ? "success" : "warning"}>
                    {noticia.publicada ? "Publicada" : "Despublicada"}
                  </Badge>
                  {noticia.destacadaHome && <Badge tone="neutral">Destacada</Badge>}
                </div>
              </div>
              <div className="flex shrink-0 gap-2">
                <Link href={`/admin/noticias/${noticia.id}/editar`}>
                  <Button variant="secondary">Editar</Button>
                </Link>
                <Button variant="danger" onClick={() => handleDelete(noticia.id)}>
                  Eliminar
                </Button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
