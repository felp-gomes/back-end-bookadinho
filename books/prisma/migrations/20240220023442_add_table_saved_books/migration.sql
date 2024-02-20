-- CreateTable
CREATE TABLE "saved_books" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(45) NOT NULL,
    "author" VARCHAR(45) NOT NULL,
    "description" VARCHAR(255) NOT NULL,
    "photo" VARCHAR(255),
    "rate" VARCHAR(1),
    "owner_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "saved_books_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "saved_books_id_key" ON "saved_books"("id");

-- AddForeignKey
ALTER TABLE "saved_books" ADD CONSTRAINT "saved_books_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "owners"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
