import Image from "next/image";
import Link from "next/link";
import { generateExcerpt } from "@/lib/excerpt";
import { Badge } from "@/components/ui/Badge";
import { AdminCardControls } from "@/components/public/AdminCardControls";
import type { NoticiaConCategoria } from "@/types";

export function NewsCard({
  noticia,
  isAdmin = false,
  onDeleted,
}: {
  noticia: NoticiaConCategoria;
  isAdmin?: boolean;
  onDeleted?: (id: string) => void;
}) {
  return (
    <div className="group relative flex flex-col overflow-hidden rounded-lg border border-border bg-white transition-shadow hover:shadow-md">
      {isAdmin && (
        <AdminCardControls noticiaId={noticia.id} onDeleted={onDeleted} />
      )}
      <Link
        href={`/noticias/${noticia.slug}`}
        className="flex flex-1 flex-col focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
      >
        <div className="relative aspect-[16/9] w-full bg-muted-bg">
          {noticia.imagen ? (
            <Image
              src={noticia.imagen}
              alt={noticia.epigrafeImagen || noticia.titulo}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-sm text-muted">
              Sin imagen
            </div>
          )}
        </div>
        <div className="flex flex-1 flex-col gap-2 p-4">
          <div className="flex flex-wrap items-center gap-2">
            {noticia.categoria && (
              <span className="text-xs font-semibold uppercase tracking-wide text-primary">
                {noticia.categoria.nombre}
              </span>
            )}
            {isAdmin && !noticia.publicada && (
              <Badge tone="warning">Despublicada</Badge>
            )}
          </div>
          <h3 className="text-base font-semibold text-foreground group-hover:text-primary">
            {noticia.titulo}
          </h3>
          <p className="text-sm text-muted line-clamp-3">
            {generateExcerpt(noticia.contenido, 140)}
          </p>
        </div>
      </Link>
    </div>
  );
}
