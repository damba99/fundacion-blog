import { prisma } from "@/lib/prisma";
import { NoticiasExplorer } from "@/components/public/NoticiasExplorer";
import { isAdminSession } from "@/lib/auth";

const PAGE_SIZE = 9;

export const dynamic = "force-dynamic";

export default async function NoticiasPage() {
  const isAdmin = await isAdminSession();
  const where = isAdmin ? {} : { publicada: true };

  const [categorias, noticias, total] = await Promise.all([
    prisma.categoria.findMany({ orderBy: { nombre: "asc" } }),
    prisma.noticia.findMany({
      where,
      include: { categoria: true },
      orderBy: { fechaCreacion: "desc" },
      take: PAGE_SIZE,
    }),
    prisma.noticia.count({ where }),
  ]);

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-bold text-foreground sm:text-3xl">
          Noticias
        </h1>
        <p className="mt-1 text-sm text-muted">
          Todas las novedades de la fundación.
        </p>
      </div>

      <NoticiasExplorer
        categorias={categorias}
        isAdmin={isAdmin}
        initialData={{
          noticias,
          page: 1,
          hasMore: PAGE_SIZE < total,
        }}
      />
    </div>
  );
}
