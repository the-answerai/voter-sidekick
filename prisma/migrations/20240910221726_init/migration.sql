-- CreateEnum
CREATE TYPE "Locale" AS ENUM ('FEDERAL', 'STATE', 'LOCAL');

-- CreateEnum
CREATE TYPE "SubmissionStatus" AS ENUM ('NEW', 'IN_REVIEW', 'APPROVED', 'DENIED');

-- CreateEnum
CREATE TYPE "Visibility" AS ENUM ('PRIVATE', 'PUBLIC', 'SHARED');

-- CreateTable
CREATE TABLE "Bill" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "summary" TEXT,
    "tags" TEXT[],
    "source_link" TEXT,
    "locale" "Locale" NOT NULL,
    "date_added" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "policyArea" TEXT NOT NULL,
    "latestTextVersionUrl" TEXT NOT NULL,
    "latestPdfVersionUrl" TEXT NOT NULL,
    "introducedDate" TIMESTAMP(3) NOT NULL,
    "lastUpdatedDate" TIMESTAMP(3) NOT NULL,
    "congress" INTEGER NOT NULL,
    "isLaw" BOOLEAN NOT NULL,
    "originChamber" TEXT NOT NULL,
    "billType" TEXT NOT NULL,
    "billNumber" TEXT NOT NULL,
    "fullBillJson" JSONB NOT NULL,

    CONSTRAINT "Bill_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserSubmission" (
    "id" SERIAL NOT NULL,
    "law_title" TEXT NOT NULL,
    "law_source" TEXT NOT NULL,
    "pdf_link" TEXT NOT NULL,
    "user_id" INTEGER NOT NULL,
    "status" "SubmissionStatus" NOT NULL,
    "denial_reason" TEXT,
    "date_submitted" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserSubmission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "username" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ResearchProject" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "intent" TEXT,
    "userId" INTEGER,
    "savedDocuments" TEXT[],
    "savedExcerpts" JSONB[],
    "overrideConfig" JSONB,
    "tags" TEXT[],
    "visibility" "Visibility" NOT NULL DEFAULT 'PRIVATE',
    "chatflowid" TEXT NOT NULL,
    "hasFilters" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "ResearchProject_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- AddForeignKey
ALTER TABLE "UserSubmission" ADD CONSTRAINT "UserSubmission_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ResearchProject" ADD CONSTRAINT "ResearchProject_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
