/*
  Warnings:

  - You are about to drop the column `author` on the `story` table. All the data in the column will be lost.
  - You are about to drop the column `picture` on the `story` table. All the data in the column will be lost.
  - Added the required column `authorId` to the `Story` table without a default value. This is not possible if the table is not empty.
  - Added the required column `genre` to the `Story` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `story` DROP COLUMN `author`,
    DROP COLUMN `picture`,
    ADD COLUMN `authorId` INTEGER NOT NULL,
    ADD COLUMN `coverImage` VARCHAR(191) NULL,
    ADD COLUMN `genre` VARCHAR(191) NOT NULL,
    ADD COLUMN `isPublished` BOOLEAN NOT NULL DEFAULT false;

-- AddForeignKey
ALTER TABLE `Story` ADD CONSTRAINT `Story_authorId_fkey` FOREIGN KEY (`authorId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
