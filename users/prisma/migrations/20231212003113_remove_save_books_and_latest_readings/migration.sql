/*
  Warnings:

  - You are about to drop the column `latest_readings` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `saved_books` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "users" DROP COLUMN "latest_readings",
DROP COLUMN "saved_books";
