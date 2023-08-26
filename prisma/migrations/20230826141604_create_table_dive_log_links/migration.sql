-- CreateTable
CREATE TABLE "dive_log_links" (
    "uuid" TEXT NOT NULL,
    "dive_log_id" INTEGER NOT NULL,
    "user_id" TEXT NOT NULL,
    "expired_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "dive_log_links_pkey" PRIMARY KEY ("uuid")
);

-- AddForeignKey
ALTER TABLE "dive_log_links" ADD CONSTRAINT "dive_log_links_dive_log_id_user_id_fkey" FOREIGN KEY ("dive_log_id", "user_id") REFERENCES "dive_logs"("id", "user_id") ON DELETE CASCADE ON UPDATE CASCADE;
