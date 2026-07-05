/**
 * Prisma-Client als Singleton.
 *
 * Im Dev-Modus verhindert das Zwischenspeichern am globalThis, dass durch
 * Next.js-Hot-Reload bei jedem Reload eine neue Verbindung geöffnet wird
 * (sonst „too many connections"). In Produktion wird genau eine Instanz erzeugt.
 */
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
