import { PrismaClient } from "@prisma/client";
import { hashPassword } from "../src/lib/auth";

const prisma = new PrismaClient();

async function main() {
  const usuario = process.env.SEED_ADMIN_USER ?? "admin";
  const password = process.env.SEED_ADMIN_PASSWORD ?? "admin";

  if (!process.env.SEED_ADMIN_USER || !process.env.SEED_ADMIN_PASSWORD) {
    console.warn(
      "⚠️  SEED_ADMIN_USER/SEED_ADMIN_PASSWORD no están definidas. " +
        `Usando credenciales de prueba (${usuario}/${password}). ` +
        "NO usar estas credenciales en producción."
    );
  }

  const passwordHash = await hashPassword(password);

  const admin = await prisma.admin.upsert({
    where: { usuario },
    update: { passwordHash },
    create: { usuario, passwordHash },
  });

  console.log(`Admin listo: ${admin.usuario} (id: ${admin.id})`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
