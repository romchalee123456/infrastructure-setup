-- AlterTable
ALTER TABLE "Borrowing" ADD COLUMN     "fine" DOUBLE PRECISION DEFAULT 0.0,
ADD COLUMN     "fine_per_day" DOUBLE PRECISION NOT NULL DEFAULT 10.0;
