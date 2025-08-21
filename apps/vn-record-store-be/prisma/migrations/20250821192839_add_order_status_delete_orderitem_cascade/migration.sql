-- AlterEnum
ALTER TYPE "OrderStatus" ADD VALUE 'PAYMENT_REQUIRED';

-- DropForeignKey
ALTER TABLE "AlbumOrderItem" DROP CONSTRAINT "AlbumOrderItem_orderId_fkey";

-- AddForeignKey
ALTER TABLE "AlbumOrderItem" ADD CONSTRAINT "AlbumOrderItem_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE CASCADE ON UPDATE CASCADE;
