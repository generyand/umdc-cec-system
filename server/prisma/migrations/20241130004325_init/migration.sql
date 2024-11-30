-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'FOCAL_PERSON',
    "department" TEXT NOT NULL,
    "contactNumber" TEXT,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "hashedPassword" TEXT NOT NULL,
    "refreshToken" TEXT,
    "resetPasswordToken" TEXT,
    "resetTokenExpiry" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserDetails" (
    "uc_ud_main_id" TEXT NOT NULL,

    CONSTRAINT "UserDetails_pkey" PRIMARY KEY ("uc_ud_main_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "users_email_idx" ON "users"("email");
