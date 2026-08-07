import type { Categoria, Noticia } from "@prisma/client";

export type NoticiaConCategoria = Noticia & { categoria: Categoria | null };
