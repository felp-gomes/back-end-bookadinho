/*
  Warnings:

  - You are about to drop the `saved_books` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "saved_books" DROP CONSTRAINT "saved_books_owner_id_fkey";

-- DropTable
DROP TABLE "saved_books";

-- CreateTable
CREATE TABLE "FavoriteBooks" (
    "owner_id" TEXT NOT NULL,
    "book_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FavoriteBooks_pkey" PRIMARY KEY ("owner_id","book_id")
);

-- AddForeignKey
ALTER TABLE "FavoriteBooks" ADD CONSTRAINT "FavoriteBooks_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "owners"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FavoriteBooks" ADD CONSTRAINT "FavoriteBooks_book_id_fkey" FOREIGN KEY ("book_id") REFERENCES "books"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
