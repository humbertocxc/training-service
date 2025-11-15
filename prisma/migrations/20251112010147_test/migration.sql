/*
  Warnings:

  - Changed the type of `category` on the `Exercise` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `division` to the `Session` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `Session` table without a default value. This is not possible if the table is not empty.
  - Added the required column `division` to the `Workout` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `Workout` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ExerciseCategory" AS ENUM ('PUSH', 'PULL', 'LEGS', 'CORE', 'SKILL');

-- CreateEnum
CREATE TYPE "Priority" AS ENUM ('PRIMARY', 'SECONDARY', 'RECOVERY');

-- CreateEnum
CREATE TYPE "WorkoutType" AS ENUM ('STRENGTH', 'SKILL', 'MOBILITY', 'CONDITIONING');

-- AlterTable
ALTER TABLE "Exercise" ADD COLUMN     "primaryMuscles" TEXT[],
ADD COLUMN     "progressionGroup" TEXT,
ADD COLUMN     "progressionLevel" INTEGER,
DROP COLUMN "category",
ADD COLUMN     "category" "ExerciseCategory" NOT NULL;

-- AlterTable
ALTER TABLE "Session" ADD COLUMN     "division" TEXT NOT NULL,
ADD COLUMN     "priority" "Priority" NOT NULL DEFAULT 'PRIMARY',
ADD COLUMN     "type" "WorkoutType" NOT NULL;

-- AlterTable
ALTER TABLE "Workout" ADD COLUMN     "division" TEXT NOT NULL,
ADD COLUMN     "priority" "Priority" NOT NULL DEFAULT 'PRIMARY',
ADD COLUMN     "type" "WorkoutType" NOT NULL;
