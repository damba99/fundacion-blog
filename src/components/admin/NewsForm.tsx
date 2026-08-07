"use client";

import { FormEvent, useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import type { Categoria } from "@prisma/client";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { RichTextEditor } from "@/components/admin/RichTextEditor";
import type { NoticiaConCategoria } from "@/types";

interface NewsFormProps {
  noticia?: NoticiaConCategoria;
}

export function NewsForm({ noticia }: NewsFormProps) {
  const router = useRouter();
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [titulo, setTitulo] = useState(noticia?.titulo ?? "");
  const [contenido, setContenido] = useState(noticia?.contenido ?? "");
  const [imagen, setImagen] = useState(noticia?.imagen ?? "");
  const [epigrafeImagen, setEpigrafeImagen] = useState(noticia?.epigrafeImagen ?? "");
  const [categoriaId, setCategoriaId] = useState(noticia?.categoriaId ?? "");
  const [destacadaHome, setDestacadaHome] = useState(noticia?.destacadaHome ?? false);
  const [publicada, setPublicada] = useState(noticia?.publicada ?? true);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/categorias")
      .then((res) => res.json())
      .then(setCategorias);
  }, []);

  async function handleImageChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError("");

    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/upload", { method: "POST", body: formData });
    const data = await res.json();

    if (!res.ok) {
      setError(data?.error ?? "No se pudo subir la imagen");
      setUploading(false);
      return;
    }

    setImagen(data.url);
    setUploading(false);
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    if (!titulo.trim() || !contenido.trim() || contenido === "<p></p>") {
      setError("El título y el contenido son obligatorios");
      return;
    }

    setSaving(true);
    setError("");

    const url = noticia ? `/api/noticias/${noticia.id}` : "/api/noticias";
    const method = noticia ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        titulo: titulo.trim(),
        contenido,
        imagen: imagen || null,
        epigrafeImagen: epigrafeImagen || null,
        categoriaId: categoriaId || null,
        destacadaHome,
        publicada,
      }),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => null);
      setError(data?.error ?? "No se pudo guardar la noticia");
      setSaving(false);
      return;
    }

    router.push("/admin/noticias");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6" noValidate>
      <div className="flex flex-col gap-1">
        <label htmlFor="titulo" className="text-sm font-medium text-foreground">
          Título *
        </label>
        <Input
          id="titulo"
          value={titulo}
          onChange={(event) => setTitulo(event.target.value)}
          required
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-foreground">Contenido *</label>
        <RichTextEditor value={contenido} onChange={setContenido} />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1">
          <label htmlFor="imagen" className="text-sm font-medium text-foreground">
            Imagen
          </label>
          <input
            id="imagen"
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            onChange={handleImageChange}
            className="text-sm"
          />
          {uploading && <p className="text-xs text-muted">Subiendo imagen...</p>}
          {imagen && (
            <div className="relative mt-2 h-32 w-full max-w-xs overflow-hidden rounded-md border border-border">
              <Image src={imagen} alt="Vista previa" fill className="object-cover" />
            </div>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="epigrafe" className="text-sm font-medium text-foreground">
            Epígrafe de la imagen
          </label>
          <Input
            id="epigrafe"
            value={epigrafeImagen}
            onChange={(event) => setEpigrafeImagen(event.target.value)}
            disabled={!imagen}
            placeholder={imagen ? "Descripción de la imagen" : "Subí una imagen primero"}
          />
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="categoria" className="text-sm font-medium text-foreground">
          Categoría
        </label>
        <select
          id="categoria"
          value={categoriaId}
          onChange={(event) => setCategoriaId(event.target.value)}
          className="w-full max-w-xs rounded-md border border-border bg-white px-3 py-2 text-sm text-foreground focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-primary"
        >
          <option value="">Sin categoría</option>
          {categorias.map((categoria) => (
            <option key={categoria.id} value={categoria.id}>
              {categoria.nombre}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:gap-6">
        <label className="flex items-center gap-2 text-sm text-foreground">
          <input
            type="checkbox"
            checked={destacadaHome}
            onChange={(event) => setDestacadaHome(event.target.checked)}
            className="h-4 w-4"
          />
          Destacada en home
        </label>
        <label className="flex items-center gap-2 text-sm text-foreground">
          <input
            type="checkbox"
            checked={publicada}
            onChange={(event) => setPublicada(event.target.checked)}
            className="h-4 w-4"
          />
          Publicada
        </label>
      </div>

      {error && (
        <p className="text-sm text-danger" role="alert">
          {error}
        </p>
      )}

      <div className="flex gap-2">
        <Button type="submit" disabled={saving || uploading}>
          {saving ? "Guardando..." : "Guardar noticia"}
        </Button>
        <Button type="button" variant="secondary" onClick={() => router.push("/admin/noticias")}>
          Cancelar
        </Button>
      </div>
    </form>
  );
}
