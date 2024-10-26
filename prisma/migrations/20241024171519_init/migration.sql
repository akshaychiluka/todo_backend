-- CreateTable
CREATE TABLE "User_table" (
    "id" SERIAL NOT NULL,
    "user_name" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "full_name" TEXT NOT NULL,

    CONSTRAINT "User_table_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Todo_table" (
    "id" SERIAL NOT NULL,
    "descrption" TEXT NOT NULL,
    "done" BOOLEAN NOT NULL,
    "user_id" INTEGER NOT NULL,

    CONSTRAINT "Todo_table_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Todo_table" ADD CONSTRAINT "Todo_table_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User_table"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
