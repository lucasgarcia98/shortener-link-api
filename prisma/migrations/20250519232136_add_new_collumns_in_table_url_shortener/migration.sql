/*
  Warnings:

  - Added the required column `code` to the `UrlShortener` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "UrlShortener" ADD COLUMN     "clicks" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "code" TEXT NOT NULL;
