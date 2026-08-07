import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";

export async function GET(request: NextRequest) {
  if (!getAdminSession(request)) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const usuarios = await prisma.usuario.findMany({
    include: { _count: { select: { comentarios: true } } },
    orderBy: { fechaUltimaActividad: "desc" },
  });

  return NextResponse.json(usuarios);
}
