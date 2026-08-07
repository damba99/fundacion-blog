"use client";

import { CommentForm } from "@/components/public/CommentForm";

interface ComentarioAprobado {
  id: string;
  nombreMostrado: string;
  contenido: string;
  fechaCreacion: string | Date;
}

export function CommentSection({
  noticiaId,
  comentarios,
}: {
  noticiaId: string;
  comentarios: ComentarioAprobado[];
}) {
  return (
    <section className="flex flex-col gap-6" aria-labelledby="comentarios-heading">
      <h2 id="comentarios-heading" className="text-xl font-bold text-foreground">
        Comentarios {comentarios.length > 0 && `(${comentarios.length})`}
      </h2>

      {comentarios.length === 0 ? (
        <p className="text-sm text-muted">Todavía no hay comentarios. ¡Sé el primero!</p>
      ) : (
        <ul className="flex flex-col gap-4">
          {comentarios.map((comentario) => (
            <li
              key={comentario.id}
              className="rounded-md border border-border bg-white p-4"
            >
              <div className="mb-1 flex items-center justify-between">
                <span className="text-sm font-semibold text-foreground">
                  {comentario.nombreMostrado}
                </span>
                <time
                  className="text-xs text-muted"
                  dateTime={new Date(comentario.fechaCreacion).toISOString()}
                >
                  {new Date(comentario.fechaCreacion).toLocaleDateString("es-AR")}
                </time>
              </div>
              <p className="text-sm text-foreground">{comentario.contenido}</p>
            </li>
          ))}
        </ul>
      )}

      <div className="border-t border-border pt-6">
        <h3 className="mb-3 text-base font-semibold text-foreground">
          Dejá tu comentario
        </h3>
        <CommentForm noticiaId={noticiaId} onCommentSubmitted={() => {}} />
      </div>
    </section>
  );
}
