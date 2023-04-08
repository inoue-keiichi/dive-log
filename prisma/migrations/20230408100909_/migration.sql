-- CreateTable
CREATE TABLE "diveLogs" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "point" TEXT NOT NULL,
    "waterTemprature" DOUBLE PRECISION,
    "transparency" DOUBLE PRECISION,

    CONSTRAINT "diveLogs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "diveLogs" ADD CONSTRAINT "diveLogs_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
