import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";
import { getClientIp } from "@/lib/ip";
import { comentarioSchema } from "@/lib/validation";

export async function GET(request: NextRequest) {
  if (!getAdminSession(request)) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const aprobado = searchParams.get("aprobado");

  const comentarios = await prisma.comentario.findMany({
    where:
      aprobado === "true"
        ? { aprobado: true }
        : aprobado === "false"
          ? { aprobado: false }
          : undefined,
    include: {
      noticia: { select: { id: true, titulo: true, slug: true } },
      usuario: { select: { id: true, bloqueado: true } },
    },
    orderBy: { fechaCreacion: "desc" },
  });

  return NextResponse.json(comentarios);
}

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const parsed = comentarioSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Datos inválidos" },
      { status: 400 }
    );
  }

  const { noticiaId, nombreMostrado, contenido } = parsed.data;

  const noticia = await prisma.noticia.findUnique({
    where: { id: noticiaId },
  });
  if (!noticia || !noticia.publicada) {
    return NextResponse.json(
      { error: "Noticia no encontrada" },
      { status: 404 }
    );
  }

  const ip = getClientIp(request.headers);

  const usuario = await prisma.usuario.upsert({
    where: { id: ip },
    update: { nombre: nombreMostrado },
    create: { id: ip, nombre: nombreMostrado },
  });

  if (usuario.bloqueado) {
    return NextResponse.json(
      { error: "Tu usuario fue bloqueado y no puede comentar" },
      { status: 403 }
    );
  }

  const comentario = await prisma.comentario.create({
    data: {
      noticiaId,
      usuarioId: usuario.id,
      nombreMostrado,
      contenido,
      aprobado: false,
    },
  });

  return NextResponse.json(comentario, { status: 201 });
}
