import { NextRequest, NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { InvalidImageError, saveImage } from "@/lib/storage";

export async function POST(request: NextRequest) {
  if (!getAdminSession(request)) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const formData = await request.formData().catch(() => null);
  const file = formData?.get("file");

  if (!file || !(file instanceof File)) {
    return NextResponse.json(
      { error: "No se envió ningún archivo" },
      { status: 400 }
    );
  }

  try {
    const url = await saveImage(file);
    return NextResponse.json({ url });
  } catch (error) {
    if (error instanceof InvalidImageError) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json(
      { error: "No se pudo guardar la imagen" },
      { status: 500 }
    );
  }
}
