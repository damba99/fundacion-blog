"use client";

import { FormEvent, useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input, Textarea } from "@/components/ui/Input";

const NAME_STORAGE_KEY = "fundacion_comentario_nombre";

export function CommentForm({
  noticiaId,
  onCommentSubmitted,
}: {
  noticiaId: string;
  onCommentSubmitted: () => void;
}) {
  const [nombre, setNombre] = useState("");
  const [contenido, setContenido] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error" | "blocked">(
    "idle"
  );
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const stored = window.localStorage.getItem(NAME_STORAGE_KEY);
    // eslint-disable-next-line react-hooks/set-state-in-effect -- initializing from localStorage on mount
    if (stored) setNombre(stored);
  }, []);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    if (!nombre.trim() || !contenido.trim()) {
      setStatus("error");
      setErrorMessage("El nombre y el comentario son obligatorios.");
      return;
    }

    setStatus("loading");
    setErrorMessage("");

    try {
      const res = await fetch("/api/comentarios", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          noticiaId,
          nombreMostrado: nombre.trim(),
          contenido: contenido.trim(),
        }),
      });

      if (res.status === 403) {
        setStatus("blocked");
        return;
      }

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        setStatus("error");
        setErrorMessage(data?.error ?? "No se pudo enviar el comentario.");
        return;
      }

      window.localStorage.setItem(NAME_STORAGE_KEY, nombre.trim());
      setContenido("");
      setStatus("success");
      onCommentSubmitted();
    } catch {
      setStatus("error");
      setErrorMessage("No se pudo enviar el comentario. Intentá de nuevo.");
    }
  }

  if (status === "blocked") {
    return (
      <p className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-danger">
        Tu usuario fue bloqueado y no puede enviar comentarios.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3" noValidate>
      <div className="flex flex-col gap-1">
        <label htmlFor="nombre" className="text-sm font-medium text-foreground">
          Tu nombre
        </label>
        <Input
          id="nombre"
          value={nombre}
          onChange={(event) => setNombre(event.target.value)}
          placeholder="Nombre"
          maxLength={80}
          required
        />
      </div>
      <div className="flex flex-col gap-1">
        <label htmlFor="contenido" className="text-sm font-medium text-foreground">
          Comentario
        </label>
        <Textarea
          id="contenido"
          value={contenido}
          onChange={(event) => setContenido(event.target.value)}
          placeholder="Escribí tu comentario..."
          rows={4}
          maxLength={2000}
          required
        />
      </div>

      {status === "error" && (
        <p className="text-sm text-danger" role="alert">
          {errorMessage}
        </p>
      )}
      {status === "success" && (
        <p className="text-sm text-success" role="status">
          Comentario enviado, será revisado antes de publicarse.
        </p>
      )}

      <div>
        <Button type="submit" disabled={status === "loading"}>
          {status === "loading" ? "Enviando..." : "Enviar comentario"}
        </Button>
      </div>
    </form>
  );
}
