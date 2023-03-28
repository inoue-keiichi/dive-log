/*
  Warnings:

  - You are about to drop the `DiveLog` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE `DiveLog`;

-- CreateTable
CREATE TABLE `DiveLogs` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `point` VARCHAR(191) NOT NULL,
    `waterTemprature` DOUBLE NULL,
    `transparency` DOUBLE NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
