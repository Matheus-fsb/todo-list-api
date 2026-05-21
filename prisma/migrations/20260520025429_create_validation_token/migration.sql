-- CreateTable
CREATE TABLE "ValidationToken" (
    "id" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "ValidationToken_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ValidationToken" ADD CONSTRAINT "ValidationToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
