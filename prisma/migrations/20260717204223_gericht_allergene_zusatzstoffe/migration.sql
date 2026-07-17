-- AlterTable
ALTER TABLE "Gericht" ADD COLUMN     "allergene" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "zusatzstoffe" TEXT[] DEFAULT ARRAY[]::TEXT[];
