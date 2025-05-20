-- DropForeignKey
ALTER TABLE "UrlShortener" DROP CONSTRAINT "UrlShortener_userId_fkey";

-- AlterTable
ALTER TABLE "UrlShortener" ALTER COLUMN "userId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "UrlShortener" ADD CONSTRAINT "UrlShortener_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
