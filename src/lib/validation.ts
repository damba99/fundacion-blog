import { z } from "zod";

export const categoriaSchema = z.object({
  nombre: z.string().trim().min(1, "El nombre es obligatorio"),
});

export const noticiaSchema = z.object({
  titulo: z.string().trim().min(1, "El título es obligatorio"),
  contenido: z.string().trim().min(1, "El contenido es obligatorio"),
  imagen: z.string().trim().optional().nullable(),
  epigrafeImagen: z.string().trim().optional().nullable(),
  categoriaId: z.string().trim().optional().nullable(),
  destacadaHome: z.boolean().optional(),
  publicada: z.boolean().optional(),
});

export const comentarioSchema = z.object({
  noticiaId: z.string().trim().min(1),
  nombreMostrado: z.string().trim().min(1, "El nombre es obligatorio").max(80),
  contenido: z.string().trim().min(1, "El comentario no puede estar vacío").max(2000),
});

export const loginSchema = z.object({
  usuario: z.string().trim().min(1),
  password: z.string().min(1),
});
