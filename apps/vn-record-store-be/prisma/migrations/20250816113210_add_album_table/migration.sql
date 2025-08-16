/*
  Warnings:

  - You are about to drop the column `artist` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `duration` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `genre` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `releaseYear` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `trackCount` on the `Product` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Product" DROP COLUMN "artist",
DROP COLUMN "duration",
DROP COLUMN "genre",
DROP COLUMN "releaseYear",
DROP COLUMN "trackCount";

-- CreateTable
CREATE TABLE "Album" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "artist" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "image" TEXT NOT NULL,
    "genre" TEXT NOT NULL,
    "releaseYear" INTEGER NOT NULL,
    "trackCount" INTEGER NOT NULL,
    "duration" TEXT NOT NULL,
    "stripePriceId" TEXT NOT NULL,
    "isFeatured" BOOLEAN DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Album_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AlbumOrderItem" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "albumId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "AlbumOrderItem_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "AlbumOrderItem" ADD CONSTRAINT "AlbumOrderItem_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AlbumOrderItem" ADD CONSTRAINT "AlbumOrderItem_albumId_fkey" FOREIGN KEY ("albumId") REFERENCES "Album"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
