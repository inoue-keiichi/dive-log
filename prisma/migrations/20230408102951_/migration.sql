/*
  Warnings:

  - You are about to drop the `users` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "diveLogs" DROP CONSTRAINT "diveLogs_userId_fkey";

-- DropTable
DROP TABLE "users";
