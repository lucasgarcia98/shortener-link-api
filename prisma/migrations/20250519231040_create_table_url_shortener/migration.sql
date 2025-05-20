-- CreateTable
CREATE TABLE "UrlShortener" (
    "id" TEXT NOT NULL,
    "urlOriginal" TEXT NOT NULL,
    "urlShort" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "userId" TEXT NOT NULL,

    CONSTRAINT "UrlShortener_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "UrlShortener" ADD CONSTRAINT "UrlShortener_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
