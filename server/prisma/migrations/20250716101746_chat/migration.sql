/*
  Warnings:

  - You are about to drop the column `created_at` on the `chats` table. All the data in the column will be lost.
  - You are about to drop the column `group_id` on the `chats` table. All the data in the column will be lost.
  - Added the required column `groupId` to the `chats` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "chats" DROP CONSTRAINT "chats_group_id_fkey";

-- DropIndex
DROP INDEX "chats_created_at_idx";

-- AlterTable
ALTER TABLE "chats" DROP COLUMN "created_at",
DROP COLUMN "group_id",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "groupId" UUID NOT NULL;

-- CreateIndex
CREATE INDEX "chats_createdAt_idx" ON "chats"("createdAt");

-- AddForeignKey
ALTER TABLE "chats" ADD CONSTRAINT "chats_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "chat_groups"("id") ON DELETE CASCADE ON UPDATE CASCADE;
