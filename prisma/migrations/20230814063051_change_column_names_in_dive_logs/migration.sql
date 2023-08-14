/*
  Warnings:

  - You are about to drop the `diveLogs` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "diveLogs";

-- CreateTable
CREATE TABLE "dive_logs" (
    "id" SERIAL NOT NULL,
    "user_id" TEXT NOT NULL,
    "date" TEXT NOT NULL,
    "place" TEXT,
    "point" TEXT,
    "diving_start_time" TEXT,
    "diving_end_time" TEXT,
    "average_depth" DOUBLE PRECISION,
    "max_depth" DOUBLE PRECISION,
    "tank_start_pressure" INTEGER,
    "tank_end_pressure" INTEGER,
    "tank_kind" "TankKind",
    "suit" "Suit",
    "weight" DOUBLE PRECISION,
    "weather" "Weather",
    "temprature" DOUBLE PRECISION,
    "water_temprature" DOUBLE PRECISION,
    "transparency" DOUBLE PRECISION,
    "memo" TEXT,

    CONSTRAINT "dive_logs_pkey" PRIMARY KEY ("id","user_id")
);
