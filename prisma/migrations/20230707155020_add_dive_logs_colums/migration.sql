-- CreateEnum
CREATE TYPE "TankKind" AS ENUM ('STEEL', 'ALUMINUM');

-- CreateEnum
CREATE TYPE "Suit" AS ENUM ('WET', 'DRY');

-- CreateEnum
CREATE TYPE "Weather" AS ENUM ('SUNNY', 'SUNNY_CLOUDY', 'CLOUDY', 'RAINY', 'SNOWY');

-- AlterTable
ALTER TABLE "diveLogs" ADD COLUMN     "averageDepth" DOUBLE PRECISION,
ADD COLUMN     "divingEndTime" TEXT,
ADD COLUMN     "divingStartTime" TEXT,
ADD COLUMN     "maxDepth" DOUBLE PRECISION,
ADD COLUMN     "memo" TEXT,
ADD COLUMN     "place" TEXT,
ADD COLUMN     "suit" "Suit",
ADD COLUMN     "tankEndPressure" INTEGER,
ADD COLUMN     "tankKind" "TankKind",
ADD COLUMN     "tankStartPressure" INTEGER,
ADD COLUMN     "temprature" DOUBLE PRECISION,
ADD COLUMN     "weather" "Weather",
ADD COLUMN     "weight" DOUBLE PRECISION;
