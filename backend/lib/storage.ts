import { randomUUID } from "crypto";
import { mkdir, writeFile } from "fs/promises";
import path from "path";

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const MAX_SIZE_BYTES = 5 * 1024 * 1024; // 5MB

export class InvalidImageError extends Error {}

/**
 * Guarda una imagen subida en el filesystem local (/public/uploads) y
 * devuelve la URL pública. Aislado en este módulo para poder swappear a
 * S3/Cloudinary más adelante sin tocar el resto del código.
 */
export async function saveImage(file: File): Promise<string> {
  if (!ALLOWED_TYPES.includes(file.type)) {
    throw new InvalidImageError(
      "Tipo de archivo no permitido. Usá JPG, PNG, WEBP o GIF."
    );
  }
  if (file.size > MAX_SIZE_BYTES) {
    throw new InvalidImageError("La imagen no puede superar los 5MB.");
  }

  await mkdir(UPLOAD_DIR, { recursive: true });

  const extension = file.type.split("/")[1];
  const filename = `${randomUUID()}.${extension}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  await writeFile(path.join(UPLOAD_DIR, filename), buffer);

  return `/uploads/${filename}`;
}
