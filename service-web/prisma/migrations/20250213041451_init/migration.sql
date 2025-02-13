-- CreateEnum
CREATE TYPE "Role" AS ENUM ('admin', 'user');

-- CreateEnum
CREATE TYPE "Status" AS ENUM ('borrowed', 'returned');

-- CreateTable
CREATE TABLE "Book" (
    "book_id" SERIAL NOT NULL,
    "title" VARCHAR(250) NOT NULL,
    "author" VARCHAR(250) NOT NULL,
    "category" VARCHAR(250) NOT NULL,
    "total_copies" INTEGER NOT NULL DEFAULT 0,
    "available_copies" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Book_pkey" PRIMARY KEY ("book_id")
);

-- CreateTable
CREATE TABLE "Member" (
    "member_id" SERIAL NOT NULL,
    "username" VARCHAR(250) NOT NULL,
    "password" VARCHAR(250) NOT NULL,
    "first_name" VARCHAR(250) NOT NULL,
    "last_name" VARCHAR(250) NOT NULL,
    "email" VARCHAR(250) NOT NULL,
    "phone_number" VARCHAR(15) NOT NULL,
    "role" "Role" NOT NULL,
    "membership_date" DATE NOT NULL,

    CONSTRAINT "Member_pkey" PRIMARY KEY ("member_id")
);

-- CreateTable
CREATE TABLE "Borrowing" (
    "borrow_id" SERIAL NOT NULL,
    "member_id" INTEGER NOT NULL,
    "book_id" INTEGER NOT NULL,
    "borrow_date" DATE NOT NULL,
    "due_date" DATE NOT NULL,
    "return_date" TIMESTAMP(3),
    "status" "Status" NOT NULL,

    CONSTRAINT "Borrowing_pkey" PRIMARY KEY ("borrow_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Member_username_key" ON "Member"("username");

-- CreateIndex
CREATE UNIQUE INDEX "Member_email_key" ON "Member"("email");

-- AddForeignKey
ALTER TABLE "Borrowing" ADD CONSTRAINT "Borrowing_member_id_fkey" FOREIGN KEY ("member_id") REFERENCES "Member"("member_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Borrowing" ADD CONSTRAINT "Borrowing_book_id_fkey" FOREIGN KEY ("book_id") REFERENCES "Book"("book_id") ON DELETE CASCADE ON UPDATE CASCADE;
