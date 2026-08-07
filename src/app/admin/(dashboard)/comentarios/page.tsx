"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";

interface ComentarioAdmin {
  id: string;
  nombreMostrado: string;
  contenido: string;
  aprobado: boolean;
  fechaCreacion: string;
  noticia: { id: string; titulo: string; slug: string };
  usuario: { id: string; bloqueado: boolean };
}

export default function AdminComentariosPage() {
  const [tab, setTab] = useState<"pendientes" | "aprobados">("pendientes");
  const [comentarios, setComentarios] = useState<ComentarioAdmin[]>([]);
  const [loading, setLoading] = useState(true);

  async function loadComentarios(current: "pendientes" | "aprobados") {
    setLoading(true);
    const aprobado = current === "aprobados" ? "true" : "false";
    const res = await fetch(`/api/comentarios?aprobado=${aprobado}`);
    const data = await res.json();
    setComentarios(data);
    setLoading(false);
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- fetch-on-mount into local state
    loadComentarios(tab);
  }, [tab]);

  async function handleApprove(id: string) {
    await fetch(`/api/comentarios/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ aprobado: true }),
    });
    loadComentarios(tab);
  }

  async function handleDelete(id: string) {
    if (!confirm("¿Eliminar este comentario?")) return;
    await fetch(`/api/comentarios/${id}`, { method: "DELETE" });
    loadComentarios(tab);
  }

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Comentarios</h1>
        <p className="mt-1 text-sm text-muted">Moderá los comentarios de las noticias.</p>
      </div>

      <div className="flex gap-2 border-b border-border">
        <button
          onClick={() => setTab("pendientes")}
          className={`px-4 py-2 text-sm font-medium ${
            tab === "pendientes"
              ? "border-b-2 border-primary text-primary"
              : "text-muted hover:text-foreground"
          }`}
        >
          Pendientes
        </button>
        <button
          onClick={() => setTab("aprobados")}
          className={`px-4 py-2 text-sm font-medium ${
            tab === "aprobados"
              ? "border-b-2 border-primary text-primary"
              : "text-muted hover:text-foreground"
          }`}
        >
          Aprobados
        </button>
      </div>

      {loading ? (
        <p className="text-sm text-muted">Cargando...</p>
      ) : comentarios.length === 0 ? (
        <EmptyState
          title={
            tab === "pendientes"
              ? "No hay comentarios pendientes"
              : "No hay comentarios aprobados todavía"
          }
        />
      ) : (
        <ul className="flex flex-col gap-3">
          {comentarios.map((comentario) => (
            <li
              key={comentario.id}
              className="rounded-lg border border-border bg-white p-4"
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 text-sm">
                  <span className="font-semibold text-foreground">
                    {comentario.nombreMostrado}
                  </span>
                  {comentario.usuario.bloqueado && (
                    <span className="text-xs font-medium text-danger">
                      (usuario bloqueado)
                    </span>
                  )}
                </div>
                <time className="text-xs text-muted">
                  {new Date(comentario.fechaCreacion).toLocaleString("es-AR")}
                </time>
              </div>
              <p className="mt-2 text-sm text-foreground">{comentario.contenido}</p>
              <p className="mt-2 text-xs text-muted">
                En:{" "}
                <Link
                  href={`/noticias/${comentario.noticia.slug}`}
                  target="_blank"
                  className="underline hover:text-primary"
                >
                  {comentario.noticia.titulo}
                </Link>
              </p>
              <div className="mt-3 flex gap-2">
                {tab === "pendientes" && (
                  <Button onClick={() => handleApprove(comentario.id)}>Aprobar</Button>
                )}
                <Button variant="danger" onClick={() => handleDelete(comentario.id)}>
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
