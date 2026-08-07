"use client";

import { useCallback, useEffect, useState } from "react";
import { NewsCard } from "@/components/public/NewsCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import type { NoticiaConCategoria } from "@/types";
import type { Categoria } from "@prisma/client";

interface NoticiasResponse {
  noticias: NoticiaConCategoria[];
  page: number;
  hasMore: boolean;
}

export function NoticiasExplorer({
  categorias,
  initialData,
  isAdmin = false,
}: {
  categorias: Categoria[];
  initialData: NoticiasResponse;
  isAdmin?: boolean;
}) {
  const [query, setQuery] = useState("");
  const [categoriaSlug, setCategoriaSlug] = useState("");
  const [noticias, setNoticias] = useState(initialData.noticias);
  const [page, setPage] = useState(initialData.page);
  const [hasMore, setHasMore] = useState(initialData.hasMore);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);

  const fetchNoticias = useCallback(
    async (targetPage: number, append: boolean) => {
      const params = new URLSearchParams();
      if (query) params.set("q", query);
      if (categoriaSlug) params.set("categoria", categoriaSlug);
      params.set("page", String(targetPage));

      if (append) setLoadingMore(true);
      else setLoading(true);

      try {
        const res = await fetch(`/api/noticias?${params.toString()}`);
        const data: NoticiasResponse = await res.json();
        setNoticias((prev) => (append ? [...prev, ...data.noticias] : data.noticias));
        setPage(data.page);
        setHasMore(data.hasMore);
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [query, categoriaSlug]
  );

  useEffect(() => {
    const timeout = setTimeout(() => {
      fetchNoticias(1, false);
    }, 300);
    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, categoriaSlug]);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3 sm:flex-row">
        <Input
          type="search"
          placeholder="Buscar noticias..."
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          aria-label="Buscar noticias"
          className="sm:max-w-xs"
        />
        <select
          value={categoriaSlug}
          onChange={(event) => setCategoriaSlug(event.target.value)}
          aria-label="Filtrar por categoría"
          className="rounded-md border border-border bg-white px-3 py-2 text-sm text-foreground focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-primary sm:max-w-xs"
        >
          <option value="">Todas las categorías</option>
          {categorias.map((categoria) => (
            <option key={categoria.id} value={categoria.slug}>
              {categoria.nombre}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <p className="py-12 text-center text-sm text-muted">Cargando noticias...</p>
      ) : noticias.length === 0 ? (
        <EmptyState
          title="No se encontraron noticias"
          description="Probá con otra búsqueda o cambiá el filtro de categoría."
        />
      ) : (
        <>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {noticias.map((noticia) => (
              <NewsCard
                key={noticia.id}
                noticia={noticia}
                isAdmin={isAdmin}
                onDeleted={(id) =>
                  setNoticias((prev) => prev.filter((n) => n.id !== id))
                }
              />
            ))}
          </div>
          {hasMore && (
            <div className="flex justify-center">
              <Button
                variant="secondary"
                onClick={() => fetchNoticias(page + 1, true)}
                disabled={loadingMore}
              >
                {loadingMore ? "Cargando..." : "Cargar más"}
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
