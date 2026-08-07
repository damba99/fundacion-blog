import Image from "next/image";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { CommentSection } from "@/components/public/CommentSection";

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function NoticiaDetailPage({ params }: Props) {
  const { slug } = await params;

  const noticia = await prisma.noticia.findUnique({
    where: { slug },
    include: {
      categoria: true,
      comentarios: {
        where: { aprobado: true },
        orderBy: { fechaCreacion: "desc" },
      },
    },
  });

  if (!noticia || !noticia.publicada) {
    notFound();
  }

  return (
    <article className="flex flex-col gap-6">
      <div>
        {noticia.categoria && (
          <span className="text-xs font-semibold uppercase tracking-wide text-primary">
            {noticia.categoria.nombre}
          </span>
        )}
        <h1 className="mt-1 text-2xl font-bold text-foreground sm:text-3xl">
          {noticia.titulo}
        </h1>
        <time
          className="mt-2 block text-sm text-muted"
          dateTime={noticia.fechaCreacion.toISOString()}
        >
          {noticia.fechaCreacion.toLocaleDateString("es-AR", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </time>
      </div>

      {noticia.imagen && (
        <figure>
          <div className="relative aspect-[16/9] w-full overflow-hidden rounded-lg bg-muted-bg">
            <Image
              src={noticia.imagen}
              alt={noticia.epigrafeImagen || noticia.titulo}
              fill
              sizes="(max-width: 768px) 100vw, 768px"
              className="object-cover"
              priority
            />
          </div>
          {noticia.epigrafeImagen && (
            <figcaption className="mt-2 text-sm text-muted">
              {noticia.epigrafeImagen}
            </figcaption>
          )}
        </figure>
      )}

      <div
        className="prose-noticia"
        dangerouslySetInnerHTML={{ __html: noticia.contenido }}
      />

      <div className="mt-4 border-t border-border pt-8">
        <CommentSection
          noticiaId={noticia.id}
          comentarios={noticia.comentarios}
        />
      </div>
    </article>
  );
}
