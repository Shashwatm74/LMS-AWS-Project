-- CreateTable
CREATE TABLE "Otp" (
    "id" TEXT NOT NULL,
    "regNumber" TEXT NOT NULL,
    "otp" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Otp_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Otp" ADD CONSTRAINT "Otp_regNumber_fkey" FOREIGN KEY ("regNumber") REFERENCES "User"("regNumber") ON DELETE RESTRICT ON UPDATE CASCADE;
