-- CreateTable
CREATE TABLE "workouts" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT,

    CONSTRAINT "workouts_pkey" PRIMARY KEY ("id")
);
