/*
  Warnings:

  - Added the required column `userId` to the `Story` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `story` ADD COLUMN `userId` INTEGER NOT NULL,
    MODIFY `contentText` VARCHAR(191) NULL;

-- AddForeignKey
ALTER TABLE `Story` ADD CONSTRAINT `Story_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
