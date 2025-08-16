/*
  Warnings:

  - Added the required column `artist` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `duration` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `genre` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `releaseYear` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `trackCount` to the `Product` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "artist" TEXT DEFAULT '',
ADD COLUMN     "duration" TEXT DEFAULT '',
ADD COLUMN     "genre" TEXT DEFAULT '',
ADD COLUMN     "releaseYear" INTEGER DEFAULT 0,
ADD COLUMN     "trackCount" INTEGER DEFAULT 0;

-- Update existing records with album data
UPDATE "Product" SET 
  "artist" = 'Various Artists',
  "genre" = 'Pop',
  "releaseYear" = 2020,
  "trackCount" = 10,
  "duration" = '45:00'
WHERE "artist" = '';

-- Make columns required
ALTER TABLE "Product" ALTER COLUMN "artist" SET NOT NULL,
ALTER COLUMN "duration" SET NOT NULL,
ALTER COLUMN "genre" SET NOT NULL,
ALTER COLUMN "releaseYear" SET NOT NULL,
ALTER COLUMN "trackCount" SET NOT NULL;

-- Remove default values
ALTER TABLE "Product" ALTER COLUMN "artist" DROP DEFAULT,
ALTER COLUMN "duration" DROP DEFAULT,
ALTER COLUMN "genre" DROP DEFAULT,
ALTER COLUMN "releaseYear" DROP DEFAULT,
ALTER COLUMN "trackCount" DROP DEFAULT;
