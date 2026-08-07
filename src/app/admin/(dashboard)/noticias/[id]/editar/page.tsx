import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { NewsForm } from "@/components/admin/NewsForm";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditarNoticiaPage({ params }: Props) {
  const { id } = await params;

  const noticia = await prisma.noticia.findUnique({
    where: { id },
    include: { categoria: true },
  });

  if (!noticia) notFound();

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Editar noticia</h1>
        <p className="mt-1 text-sm text-muted">{noticia.titulo}</p>
      </div>
      <NewsForm noticia={noticia} />
    </div>
  );
}
