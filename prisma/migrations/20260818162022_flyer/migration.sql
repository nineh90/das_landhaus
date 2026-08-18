-- CreateTable
CREATE TABLE "Flyer" (
    "id" TEXT NOT NULL,
    "titel" TEXT NOT NULL,
    "ueberschrift" TEXT NOT NULL,
    "unterzeile" TEXT,
    "vorwort" TEXT,
    "grussformel" TEXT,
    "bild" TEXT,
    "mitEvents" BOOLEAN NOT NULL DEFAULT false,
    "mitOeffnungszeiten" BOOLEAN NOT NULL DEFAULT false,
    "gueltigVon" TIMESTAMP(3),
    "gueltigBis" TIMESTAMP(3),
    "veroeffentlicht" BOOLEAN NOT NULL DEFAULT false,
    "erstelltAm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "aktualisiertAm" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Flyer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FlyerAktion" (
    "id" TEXT NOT NULL,
    "flyerId" TEXT NOT NULL,
    "titel" TEXT NOT NULL,
    "text" TEXT,
    "hinweis" TEXT,
    "bild" TEXT,
    "reihenfolge" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "FlyerAktion_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "FlyerAktion_flyerId_reihenfolge_idx" ON "FlyerAktion"("flyerId", "reihenfolge");

-- AddForeignKey
ALTER TABLE "FlyerAktion" ADD CONSTRAINT "FlyerAktion_flyerId_fkey" FOREIGN KEY ("flyerId") REFERENCES "Flyer"("id") ON DELETE CASCADE ON UPDATE CASCADE;
