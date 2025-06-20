/*
  Warnings:

  - Made the column `description` on table `story` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `story` MODIFY `contentText` TEXT NULL,
    MODIFY `description` VARCHAR(191) NOT NULL;
