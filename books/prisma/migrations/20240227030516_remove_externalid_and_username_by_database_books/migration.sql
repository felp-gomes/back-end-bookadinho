/*
  Warnings:

  - You are about to drop the column `external_id` on the `owners` table. All the data in the column will be lost.
  - You are about to drop the column `user_name` on the `owners` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "owners_external_id_key";

-- DropIndex
DROP INDEX "owners_user_name_key";

-- AlterTable
ALTER TABLE "owners" DROP COLUMN "external_id",
DROP COLUMN "user_name";
