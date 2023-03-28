-- CreateTable
CREATE TABLE `DiveLog` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `point` VARCHAR(191) NOT NULL,
    `waterTemprature` DOUBLE NULL,
    `transparency` DOUBLE NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
