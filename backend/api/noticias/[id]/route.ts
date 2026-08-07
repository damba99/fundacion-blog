import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";
import { noticiaSchema } from "@/lib/validation";
import { slugify } from "@/lib/slug";

interface Params {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, { params }: Params) {
  const { id } = await params;
  const isAdmin = Boolean(getAdminSession(request));

  const noticia = await prisma.noticia.findUnique({
    where: { id },
    include: { categoria: true },
  });

  if (!noticia || (!noticia.publicada && !isAdmin)) {
    return NextResponse.json(
      { error: "Noticia no encontrada" },
      { status: 404 }
    );
  }

  return NextResponse.json(noticia);
}

export async function PUT(request: NextRequest, { params }: Params) {
  if (!getAdminSession(request)) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const { id } = await params;
  const body = await request.json().catch(() => null);
  const parsed = noticiaSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Datos inválidos" },
      { status: 400 }
    );
  }

  const existing = await prisma.noticia.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json(
      { error: "Noticia no encontrada" },
      { status: 404 }
    );
  }

  const data = parsed.data;
  let slug = existing.slug;
  if (slugify(data.titulo) !== slugify(existing.titulo)) {
    const baseSlug = slugify(data.titulo);
    slug = baseSlug;
    let suffix = 1;
    while (
      await prisma.noticia.findFirst({
        where: { slug, id: { not: id } },
      })
    ) {
      suffix += 1;
      slug = `${baseSlug}-${suffix}`;
    }
  }

  const noticia = await prisma.noticia.update({
    where: { id },
    data: {
      titulo: data.titulo,
      slug,
      contenido: data.contenido,
      imagen: data.imagen || null,
      epigrafeImagen: data.epigrafeImagen || null,
      categoriaId: data.categoriaId || null,
      destacadaHome: data.destacadaHome ?? false,
      publicada: data.publicada ?? true,
    },
    include: { categoria: true },
  });

  return NextResponse.json(noticia);
}

export async function DELETE(request: NextRequest, { params }: Params) {
  if (!getAdminSession(request)) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const { id } = await params;
  await prisma.noticia.delete({ where: { id } }).catch(() => null);

  return NextResponse.json({ ok: true });
}
