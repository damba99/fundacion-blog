"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";

interface UsuarioAdmin {
  id: string;
  nombre: string;
  bloqueado: boolean;
  fechaPrimerRegistro: string;
  fechaUltimaActividad: string;
  _count: { comentarios: number };
}

export default function AdminUsuariosPage() {
  const [usuarios, setUsuarios] = useState<UsuarioAdmin[]>([]);
  const [loading, setLoading] = useState(true);

  async function loadUsuarios() {
    setLoading(true);
    const res = await fetch("/api/usuarios");
    const data = await res.json();
    setUsuarios(data);
    setLoading(false);
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- fetch-on-mount into local state
    loadUsuarios();
  }, []);

  async function toggleBloqueo(id: string, bloqueado: boolean) {
    await fetch(`/api/usuarios/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ bloqueado: !bloqueado }),
    });
    loadUsuarios();
  }

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Usuarios</h1>
        <p className="mt-1 text-sm text-muted">
          Usuarios identificados por IP que comentaron en el sitio.
        </p>
      </div>

      {loading ? (
        <p className="text-sm text-muted">Cargando...</p>
      ) : usuarios.length === 0 ? (
        <EmptyState title="Todavía no hay usuarios registrados" />
      ) : (
        <div className="overflow-x-auto rounded-lg border border-border bg-white">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="border-b border-border bg-muted-bg text-xs uppercase text-muted">
              <tr>
                <th className="px-4 py-3">IP</th>
                <th className="px-4 py-3">Nombre</th>
                <th className="px-4 py-3">Comentarios</th>
                <th className="px-4 py-3">Última actividad</th>
                <th className="px-4 py-3">Estado</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {usuarios.map((usuario) => (
                <tr key={usuario.id}>
                  <td className="px-4 py-3 font-mono text-xs">{usuario.id}</td>
                  <td className="px-4 py-3">{usuario.nombre}</td>
                  <td className="px-4 py-3">{usuario._count.comentarios}</td>
                  <td className="px-4 py-3 text-muted">
                    {new Date(usuario.fechaUltimaActividad).toLocaleString("es-AR")}
                  </td>
                  <td className="px-4 py-3">
                    <Badge tone={usuario.bloqueado ? "danger" : "success"}>
                      {usuario.bloqueado ? "Bloqueado" : "Activo"}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    <Button
                      variant={usuario.bloqueado ? "secondary" : "danger"}
                      onClick={() => toggleBloqueo(usuario.id, usuario.bloqueado)}
                    >
                      {usuario.bloqueado ? "Desbloquear" : "Bloquear"}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
