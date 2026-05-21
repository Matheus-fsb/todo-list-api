/*
  Warnings:

  - You are about to drop the column `expiresIn` on the `ValidationToken` table. All the data in the column will be lost.
  - Added the required column `expiresAt` to the `ValidationToken` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ValidationToken" DROP COLUMN "expiresIn",
ADD COLUMN     "expiresAt" TIMESTAMP(3) NOT NULL;
