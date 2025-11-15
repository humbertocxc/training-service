/*
  Warnings:

  - You are about to drop the column `sets` on the `SessionExercise` table. All the data in the column will be lost.
  - Added the required column `setNumber` to the `SessionExercise` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "SessionExercise" DROP COLUMN "sets",
ADD COLUMN     "rest" INTEGER,
ADD COLUMN     "setNumber" INTEGER NOT NULL;
