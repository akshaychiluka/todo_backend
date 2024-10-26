/*
  Warnings:

  - A unique constraint covering the columns `[user_name]` on the table `User_table` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "User_table_user_name_key" ON "User_table"("user_name");
