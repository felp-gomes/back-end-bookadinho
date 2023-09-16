/*
  Warnings:

  - A unique constraint covering the columns `[id]` on the table `Users` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Users" ALTER COLUMN "password" SET DATA TYPE VARCHAR(64);

-- CreateIndex
CREATE UNIQUE INDEX "Users_id_key" ON "Users"("id");
