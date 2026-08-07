import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";
import { categoriaSchema } from "@/lib/validation";
import { slugify } from "@/lib/slug";

export async function GET() {
  const categorias = await prisma.categoria.findMany({
    orderBy: { nombre: "asc" },
  });
  return NextResponse.json(categorias);
}

export async function POST(request: NextRequest) {
  if (!getAdminSession(request)) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

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

  const existente = await prisma.categoria.findFirst({
    where: { OR: [{ nombre }, { slug }] },
  });
  if (existente) {
    return NextResponse.json(
      { error: "Ya existe una categoría con ese nombre" },
      { status: 409 }
    );
  }

  const categoria = await prisma.categoria.create({
    data: { nombre, slug },
  });

  return NextResponse.json(categoria, { status: 201 });
}
