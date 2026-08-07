import { prisma } from "@/lib/prisma";

export async function getMetricas() {
  const [
    noticiasPublicadas,
    noticiasDespublicadas,
    comentariosAprobados,
    comentariosPendientes,
    usuariosTotal,
    usuariosBloqueados,
    noticiasConMasComentarios,
    ultimosComentarios,
    ultimasNoticias,
  ] = await Promise.all([
    prisma.noticia.count({ where: { publicada: true } }),
    prisma.noticia.count({ where: { publicada: false } }),
    prisma.comentario.count({ where: { aprobado: true } }),
    prisma.comentario.count({ where: { aprobado: false } }),
    prisma.usuario.count(),
    prisma.usuario.count({ where: { bloqueado: true } }),
    prisma.noticia.findMany({
      take: 5,
      orderBy: { comentarios: { _count: "desc" } },
      select: {
        id: true,
        titulo: true,
        slug: true,
        _count: { select: { comentarios: true } },
      },
    }),
    prisma.comentario.findMany({
      take: 5,
      orderBy: { fechaCreacion: "desc" },
      include: { noticia: { select: { titulo: true, slug: true } } },
    }),
    prisma.noticia.findMany({
      take: 5,
      orderBy: { fechaCreacion: "desc" },
      select: { id: true, titulo: true, slug: true, fechaCreacion: true },
    }),
  ]);

  return {
    noticias: {
      publicadas: noticiasPublicadas,
      despublicadas: noticiasDespublicadas,
    },
    comentarios: {
      aprobados: comentariosAprobados,
      pendientes: comentariosPendientes,
    },
    usuarios: {
      total: usuariosTotal,
      bloqueados: usuariosBloqueados,
    },
    noticiasConMasComentarios,
    actividadReciente: {
      comentarios: ultimosComentarios,
      noticias: ultimasNoticias,
    },
  };
}
