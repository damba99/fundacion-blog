import { prisma } from "@/lib/prisma";
import { NewsCard } from "@/components/public/NewsCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { isAdminSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [noticias, isAdmin] = await Promise.all([
    prisma.noticia.findMany({
      where: { publicada: true, destacadaHome: true },
      include: { categoria: true },
      orderBy: { fechaCreacion: "desc" },
    }),
    isAdminSession(),
  ]);

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-bold text-foreground sm:text-3xl">
          Noticias destacadas
        </h1>
        <p className="mt-1 text-sm text-muted">
          Las últimas novedades de la fundación.
        </p>
      </div>

      {noticias.length === 0 ? (
        <EmptyState
          title="Todavía no hay noticias destacadas"
          description="Cuando el equipo publique novedades destacadas, van a aparecer acá."
        />
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {noticias.map((noticia) => (
            <NewsCard key={noticia.id} noticia={noticia} isAdmin={isAdmin} />
          ))}
        </div>
      )}
    </div>
  );
}
