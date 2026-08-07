import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";
import { noticiaSchema } from "@/lib/validation";
import { slugify } from "@/lib/slug";

const PAGE_SIZE = 9;

export async function GET(request: NextRequest) {
  const isAdmin = Boolean(getAdminSession(request));
  const { searchParams } = new URL(request.url);

  const categoriaSlug = searchParams.get("categoria");
  const query = searchParams.get("q")?.trim();
  const destacada = searchParams.get("destacada");
  const page = Math.max(1, Number(searchParams.get("page") ?? "1") || 1);
  const publicadaParam = searchParams.get("publicada");

  const where: Prisma.NoticiaWhereInput = {};

  if (!isAdmin) {
    where.publicada = true;
  } else if (publicadaParam === "true") {
    where.publicada = true;
  } else if (publicadaParam === "false") {
    where.publicada = false;
  }

  if (categoriaSlug) {
    where.categoria = { slug: categoriaSlug };
  }

  if (destacada === "true") {
    where.destacadaHome = true;
  }

  if (query) {
    where.OR = [
      { titulo: { contains: query } },
      { contenido: { contains: query } },
    ];
  }

  const [noticias, total] = await Promise.all([
    prisma.noticia.findMany({
      where,
      include: { categoria: true },
      orderBy: { fechaCreacion: "desc" },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
    prisma.noticia.count({ where }),
  ]);

  return NextResponse.json({
    noticias,
    total,
    page,
    pageSize: PAGE_SIZE,
    hasMore: page * PAGE_SIZE < total,
  });
}

export async function POST(request: NextRequest) {
  if (!getAdminSession(request)) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const parsed = noticiaSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Datos inválidos" },
      { status: 400 }
    );
  }

  const data = parsed.data;
  const baseSlug = slugify(data.titulo);
  let slug = baseSlug;
  let suffix = 1;
  while (await prisma.noticia.findUnique({ where: { slug } })) {
    suffix += 1;
    slug = `${baseSlug}-${suffix}`;
  }

  const noticia = await prisma.noticia.create({
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

  return NextResponse.json(noticia, { status: 201 });
}
