"use client";

import { FormEvent, useEffect, useState } from "react";
import type { Categoria } from "@prisma/client";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { EmptyState } from "@/components/ui/EmptyState";

export default function AdminCategoriasPage() {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState(true);
  const [nombre, setNombre] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function loadCategorias() {
    setLoading(true);
    const res = await fetch("/api/categorias");
    const data = await res.json();
    setCategorias(data);
    setLoading(false);
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- fetch-on-mount into local state
    loadCategorias();
  }, []);

  function startEdit(categoria: Categoria) {
    setEditingId(categoria.id);
    setNombre(categoria.nombre);
    setError("");
  }

  function cancelEdit() {
    setEditingId(null);
    setNombre("");
    setError("");
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!nombre.trim()) {
      setError("El nombre es obligatorio");
      return;
    }

    setSubmitting(true);
    setError("");

    const url = editingId ? `/api/categorias/${editingId}` : "/api/categorias";
    const method = editingId ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nombre: nombre.trim() }),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => null);
      setError(data?.error ?? "No se pudo guardar la categoría");
      setSubmitting(false);
      return;
    }

    cancelEdit();
    setSubmitting(false);
    loadCategorias();
  }

  async function handleDelete(id: string) {
    if (!confirm("¿Eliminar esta categoría? Las noticias asociadas quedarán sin categoría.")) {
      return;
    }
    await fetch(`/api/categorias/${id}`, { method: "DELETE" });
    loadCategorias();
  }

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Categorías</h1>
        <p className="mt-1 text-sm text-muted">Gestioná las categorías de noticias.</p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-3 rounded-lg border border-border bg-white p-4 sm:flex-row sm:items-end"
      >
        <div className="flex flex-1 flex-col gap-1">
          <label htmlFor="nombre" className="text-sm font-medium text-foreground">
            {editingId ? "Editar categoría" : "Nueva categoría"}
          </label>
          <Input
            id="nombre"
            value={nombre}
            onChange={(event) => setNombre(event.target.value)}
            placeholder="Nombre de la categoría"
          />
        </div>
        <div className="flex gap-2">
          <Button type="submit" disabled={submitting}>
            {editingId ? "Guardar cambios" : "Crear"}
          </Button>
          {editingId && (
            <Button type="button" variant="secondary" onClick={cancelEdit}>
              Cancelar
            </Button>
          )}
        </div>
      </form>

      {error && (
        <p className="text-sm text-danger" role="alert">
          {error}
        </p>
      )}

      {loading ? (
        <p className="text-sm text-muted">Cargando...</p>
      ) : categorias.length === 0 ? (
        <EmptyState title="No hay categorías creadas todavía" />
      ) : (
        <ul className="divide-y divide-border rounded-lg border border-border bg-white">
          {categorias.map((categoria) => (
            <li
              key={categoria.id}
              className="flex items-center justify-between px-4 py-3"
            >
              <div>
                <p className="text-sm font-medium text-foreground">{categoria.nombre}</p>
                <p className="text-xs text-muted">/{categoria.slug}</p>
              </div>
              <div className="flex gap-2">
                <Button variant="secondary" onClick={() => startEdit(categoria)}>
                  Editar
                </Button>
                <Button variant="danger" onClick={() => handleDelete(categoria.id)}>
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
