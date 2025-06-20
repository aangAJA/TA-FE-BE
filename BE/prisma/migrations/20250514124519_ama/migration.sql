/*
  Warnings:

  - You are about to drop the column `authorId` on the `story` table. All the data in the column will be lost.
  - You are about to drop the column `content` on the `story` table. All the data in the column will be lost.
  - You are about to drop the column `coverImage` on the `story` table. All the data in the column will be lost.
  - You are about to drop the column `genre` on the `story` table. All the data in the column will be lost.
  - You are about to drop the column `isPublished` on the `story` table. All the data in the column will be lost.
  - Added the required column `author` to the `Story` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `story` DROP FOREIGN KEY `Story_authorId_fkey`;

-- AlterTable
ALTER TABLE `story` DROP COLUMN `authorId`,
    DROP COLUMN `content`,
    DROP COLUMN `coverImage`,
    DROP COLUMN `genre`,
    DROP COLUMN `isPublished`,
    ADD COLUMN `author` VARCHAR(191) NOT NULL,
    ADD COLUMN `contentFile` VARCHAR(191) NULL,
    ADD COLUMN `contentText` VARCHAR(191) NULL,
    ADD COLUMN `description` VARCHAR(191) NULL,
    ADD COLUMN `thumbnail` VARCHAR(191) NULL;
