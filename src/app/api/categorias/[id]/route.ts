import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";
import { categoriaSchema } from "@/lib/validation";
import { slugify } from "@/lib/slug";

interface Params {
  params: Promise<{ id: string }>;
}

export async function PUT(request: NextRequest, { params }: Params) {
  if (!getAdminSession(request)) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const { id } = await params;
  const body = await request.json().catch(() => null);
  const parsed = categoriaSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Datos inválidos" },
      { status: 400 }
    );
  }

  const { nombre } = parsed.data;
  const slug = slugify(nombre);

  const conflicto = await prisma.categoria.findFirst({
    where: { id: { not: id }, OR: [{ nombre }, { slug }] },
  });
  if (conflicto) {
    return NextResponse.json(
      { error: "Ya existe una categoría con ese nombre" },
      { status: 409 }
    );
  }

  const categoria = await prisma.categoria
    .update({ where: { id }, data: { nombre, slug } })
    .catch(() => null);

  if (!categoria) {
    return NextResponse.json(
      { error: "Categoría no encontrada" },
      { status: 404 }
    );
  }

  return NextResponse.json(categoria);
}

export async function DELETE(request: NextRequest, { params }: Params) {
  if (!getAdminSession(request)) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const { id } = await params;

  await prisma.categoria.delete({ where: { id } }).catch(() => null);

  return NextResponse.json({ ok: true });
}
