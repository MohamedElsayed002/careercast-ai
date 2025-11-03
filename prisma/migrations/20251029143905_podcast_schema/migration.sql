-- AlterTable
ALTER TABLE "user" ADD COLUMN     "isPro" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "trialsUsed" INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "podcast" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "audioUrl" TEXT NOT NULL,
    "audioId" TEXT,
    "pdfUrl" TEXT NOT NULL,
    "pdfId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "podcast_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "podcast_userId_idx" ON "podcast"("userId");

-- AddForeignKey
ALTER TABLE "podcast" ADD CONSTRAINT "podcast_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
