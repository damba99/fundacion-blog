import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";

interface Params {
  params: Promise<{ id: string }>;
}

export async function PATCH(request: NextRequest, { params }: Params) {
  if (!getAdminSession(request)) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const { id } = await params;
  const body = await request.json().catch(() => ({}));
  const aprobado = Boolean(body?.aprobado);

  const comentario = await prisma.comentario
    .update({ where: { id }, data: { aprobado } })
    .catch(() => null);

  if (!comentario) {
    return NextResponse.json(
      { error: "Comentario no encontrado" },
      { status: 404 }
    );
  }

  return NextResponse.json(comentario);
}

export async function DELETE(request: NextRequest, { params }: Params) {
  if (!getAdminSession(request)) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const { id } = await params;
  await prisma.comentario.delete({ where: { id } }).catch(() => null);

  return NextResponse.json({ ok: true });
}
