import Link from "next/link";
import { getMetricas } from "@/lib/metricas";
import { MetricCard } from "@/components/admin/MetricCard";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const metricas = await getMetricas();

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Métricas</h1>
        <p className="mt-1 text-sm text-muted">Resumen general del sitio.</p>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        <MetricCard label="Noticias publicadas" value={metricas.noticias.publicadas} />
        <MetricCard label="Noticias despublicadas" value={metricas.noticias.despublicadas} />
        <MetricCard label="Comentarios aprobados" value={metricas.comentarios.aprobados} />
        <MetricCard label="Comentarios pendientes" value={metricas.comentarios.pendientes} />
        <MetricCard label="Usuarios únicos" value={metricas.usuarios.total} />
        <MetricCard label="Usuarios bloqueados" value={metricas.usuarios.bloqueados} />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-lg border border-border bg-white p-4">
          <h2 className="mb-3 text-sm font-semibold text-foreground">
            Noticias con más comentarios
          </h2>
          {metricas.noticiasConMasComentarios.length === 0 ? (
            <p className="text-sm text-muted">Todavía no hay datos.</p>
          ) : (
            <ul className="flex flex-col gap-2">
              {metricas.noticiasConMasComentarios.map((noticia) => (
                <li key={noticia.id} className="flex items-center justify-between text-sm">
                  <Link
                    href={`/admin/noticias/${noticia.id}/editar`}
                    className="truncate text-foreground hover:text-primary hover:underline"
                  >
                    {noticia.titulo}
                  </Link>
                  <span className="shrink-0 text-muted">
                    {noticia._count.comentarios} comentarios
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="rounded-lg border border-border bg-white p-4">
          <h2 className="mb-3 text-sm font-semibold text-foreground">
            Últimas noticias creadas
          </h2>
          {metricas.actividadReciente.noticias.length === 0 ? (
            <p className="text-sm text-muted">Todavía no hay datos.</p>
          ) : (
            <ul className="flex flex-col gap-2">
              {metricas.actividadReciente.noticias.map((noticia) => (
                <li key={noticia.id} className="flex items-center justify-between text-sm">
                  <Link
                    href={`/admin/noticias/${noticia.id}/editar`}
                    className="truncate text-foreground hover:text-primary hover:underline"
                  >
                    {noticia.titulo}
                  </Link>
                  <span className="shrink-0 text-muted">
                    {new Date(noticia.fechaCreacion).toLocaleDateString("es-AR")}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="rounded-lg border border-border bg-white p-4 lg:col-span-2">
          <h2 className="mb-3 text-sm font-semibold text-foreground">
            Últimos comentarios
          </h2>
          {metricas.actividadReciente.comentarios.length === 0 ? (
            <p className="text-sm text-muted">Todavía no hay datos.</p>
          ) : (
            <ul className="flex flex-col gap-3">
              {metricas.actividadReciente.comentarios.map((comentario) => (
                <li key={comentario.id} className="text-sm">
                  <p className="text-foreground">
                    <span className="font-medium">{comentario.nombreMostrado}</span>{" "}
                    comentó en{" "}
                    <span className="font-medium">{comentario.noticia.titulo}</span>
                  </p>
                  <p className="mt-0.5 text-xs text-muted">
                    {new Date(comentario.fechaCreacion).toLocaleString("es-AR")}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
