-- CreateTable
CREATE TABLE "Gericht" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "beschreibung" TEXT,
    "preis" DOUBLE PRECISION NOT NULL,
    "kategorie" TEXT NOT NULL,
    "bereich" TEXT NOT NULL,
    "verfuegbar" BOOLEAN NOT NULL DEFAULT true,
    "bild" TEXT,
    "reihenfolge" INTEGER NOT NULL DEFAULT 0,
    "erstelltAm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "aktualisiertAm" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Gericht_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Event" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "titel" TEXT NOT NULL,
    "beschreibung" TEXT,
    "datum" TIMESTAMP(3) NOT NULL,
    "uhrzeit" TEXT NOT NULL,
    "eintritt" TEXT,
    "bild" TEXT,
    "veroeffentlicht" BOOLEAN NOT NULL DEFAULT false,
    "erstelltAm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "aktualisiertAm" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Event_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Bild" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "alt" TEXT,
    "beschreibung" TEXT,
    "bereich" TEXT NOT NULL,
    "reihenfolge" INTEGER NOT NULL DEFAULT 0,
    "erstelltAm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Bild_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Einstellung" (
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL,

    CONSTRAINT "Einstellung_pkey" PRIMARY KEY ("key")
);

-- CreateIndex
CREATE INDEX "Gericht_bereich_verfuegbar_idx" ON "Gericht"("bereich", "verfuegbar");

-- CreateIndex
CREATE UNIQUE INDEX "Event_slug_key" ON "Event"("slug");

-- CreateIndex
CREATE INDEX "Event_veroeffentlicht_datum_idx" ON "Event"("veroeffentlicht", "datum");

-- CreateIndex
CREATE INDEX "Bild_bereich_idx" ON "Bild"("bereich");
