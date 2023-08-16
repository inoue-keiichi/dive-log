-- CreateTable
CREATE TABLE "buddy_comments" (
    "id" SERIAL NOT NULL,
    "dive_log_id" INTEGER NOT NULL,
    "user_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "comment" TEXT NOT NULL,

    CONSTRAINT "buddy_comments_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "buddy_comments" ADD CONSTRAINT "buddy_comments_dive_log_id_user_id_fkey" FOREIGN KEY ("dive_log_id", "user_id") REFERENCES "dive_logs"("id", "user_id") ON DELETE CASCADE ON UPDATE CASCADE;
