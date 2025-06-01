-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "id_nurse" UUID NOT NULL,
    "image" TEXT,
    "first_name" TEXT,
    "last_name" TEXT,
    "phone" TEXT,
    "email" TEXT,
    "gender" BOOLEAN NOT NULL,
    "agency" TEXT,
    "job" TEXT,
    "address" TEXT,
    "password" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Data" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "time" TIMESTAMP(3) NOT NULL,
    "name" TEXT,
    "status" TEXT,
    "location" TEXT,

    CONSTRAINT "Data_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "Data" ADD CONSTRAINT "Data_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
