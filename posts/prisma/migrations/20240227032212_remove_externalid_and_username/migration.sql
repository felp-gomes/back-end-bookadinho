/*
  Warnings:

  - You are about to drop the column `external_id` on the `users` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "users_external_id_key";

-- AlterTable
ALTER TABLE "users" DROP COLUMN "external_id";
