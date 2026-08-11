-- CreateTable
CREATE TABLE "Uebersetzung" (
    "id" TEXT NOT NULL,
    "modell" TEXT NOT NULL,
    "datensatzId" TEXT NOT NULL,
    "locale" TEXT NOT NULL,
    "feld" TEXT NOT NULL,
    "wert" TEXT NOT NULL,
    "aktualisiertAm" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Uebersetzung_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Uebersetzung_modell_locale_idx" ON "Uebersetzung"("modell", "locale");

-- CreateIndex
CREATE UNIQUE INDEX "Uebersetzung_modell_datensatzId_locale_feld_key" ON "Uebersetzung"("modell", "datensatzId", "locale", "feld");
