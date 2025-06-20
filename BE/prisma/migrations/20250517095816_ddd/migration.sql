/*
  Warnings:

  - Made the column `contentFile` on table `story` required. This step will fail if there are existing NULL values in that column.
  - Made the column `contentText` on table `story` required. This step will fail if there are existing NULL values in that column.
  - Made the column `thumbnail` on table `story` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `story` MODIFY `contentFile` VARCHAR(191) NOT NULL,
    MODIFY `contentText` VARCHAR(191) NOT NULL,
    MODIFY `thumbnail` VARCHAR(191) NOT NULL;
