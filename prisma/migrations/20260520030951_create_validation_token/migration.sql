/*
  Warnings:

  - Added the required column `expiresIn` to the `ValidationToken` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ValidationToken" ADD COLUMN     "expiresIn" TIMESTAMP(3) NOT NULL;
