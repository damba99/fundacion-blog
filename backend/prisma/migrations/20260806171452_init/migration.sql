-- CreateTable
CREATE TABLE "admins" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "usuario" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "fechaCreacion" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ultimoLogin" DATETIME
);

-- CreateTable
CREATE TABLE "usuarios" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nombre" TEXT NOT NULL,
    "bloqueado" BOOLEAN NOT NULL DEFAULT false,
    "fechaPrimerRegistro" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fechaUltimaActividad" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "categorias" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nombre" TEXT NOT NULL,
    "slug" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "noticias" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "titulo" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "contenido" TEXT NOT NULL,
    "imagen" TEXT,
    "epigrafeImagen" TEXT,
    "categoriaId" TEXT,
    "destacadaHome" BOOLEAN NOT NULL DEFAULT false,
    "publicada" BOOLEAN NOT NULL DEFAULT true,
    "fechaCreacion" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fechaActualizacion" DATETIME NOT NULL,
    CONSTRAINT "noticias_categoriaId_fkey" FOREIGN KEY ("categoriaId") REFERENCES "categorias" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "comentarios" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "noticiaId" TEXT NOT NULL,
    "usuarioId" TEXT NOT NULL,
    "nombreMostrado" TEXT NOT NULL,
    "contenido" TEXT NOT NULL,
    "aprobado" BOOLEAN NOT NULL DEFAULT false,
    "fechaCreacion" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "comentarios_noticiaId_fkey" FOREIGN KEY ("noticiaId") REFERENCES "noticias" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "comentarios_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "usuarios" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "admins_usuario_key" ON "admins"("usuario");

-- CreateIndex
CREATE UNIQUE INDEX "categorias_nombre_key" ON "categorias"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "categorias_slug_key" ON "categorias"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "noticias_slug_key" ON "noticias"("slug");
