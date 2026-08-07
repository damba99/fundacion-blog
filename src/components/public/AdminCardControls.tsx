"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export function AdminCardControls({
  noticiaId,
  onDeleted,
}: {
  noticiaId: string;
  onDeleted?: (id: string) => void;
}) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);

  async function handleDelete(event: React.MouseEvent) {
    event.preventDefault();
    event.stopPropagation();

    if (!confirm("¿Eliminar esta noticia? Esta acción no se puede deshacer.")) {
      return;
    }

    setDeleting(true);
    await fetch(`/api/noticias/${noticiaId}`, { method: "DELETE" });

    if (onDeleted) onDeleted(noticiaId);
    else router.refresh();
  }

  return (
    <div
      className="absolute right-2 top-2 z-10 flex gap-1"
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
      }}
    >
      <Link
        href={`/admin/noticias/${noticiaId}/editar`}
        className="rounded-md bg-white px-2 py-1 text-xs font-medium text-foreground shadow-sm ring-1 ring-border hover:bg-muted-bg focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-primary"
      >
        Editar
      </Link>
      <button
        type="button"
        onClick={handleDelete}
        disabled={deleting}
        className="rounded-md bg-danger px-2 py-1 text-xs font-medium text-white shadow-sm hover:opacity-90 disabled:opacity-50"
      >
        {deleting ? "..." : "Eliminar"}
      </button>
    </div>
  );
}
