-- CreateTable
CREATE TABLE "documents" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "metadata" JSONB,
    "embedding" vector(1536) NOT NULL,

    CONSTRAINT "documents_pkey" PRIMARY KEY ("id")
);
