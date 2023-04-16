-- CreateTable
CREATE TABLE "diveLogs" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "point" TEXT,
    "waterTemprature" DOUBLE PRECISION,
    "transparency" DOUBLE PRECISION,

    CONSTRAINT "diveLogs_pkey" PRIMARY KEY ("id","userId")
);
