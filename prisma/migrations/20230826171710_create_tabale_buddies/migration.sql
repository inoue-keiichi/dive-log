-- CreateTable
CREATE TABLE "buddies" (
    "id" SERIAL NOT NULL,
    "dive_log_id" INTEGER NOT NULL,
    "user_id" TEXT NOT NULL,

    CONSTRAINT "buddies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "buddy_comments" (
    "id" SERIAL NOT NULL,
    "buddy_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "text" TEXT NOT NULL,

    CONSTRAINT "buddy_comments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "guest_buddies" (
    "buddy_id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "guest_buddies_pkey" PRIMARY KEY ("buddy_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "guest_buddies_buddy_id_key" ON "guest_buddies"("buddy_id");

-- AddForeignKey
ALTER TABLE "buddies" ADD CONSTRAINT "buddies_dive_log_id_user_id_fkey" FOREIGN KEY ("dive_log_id", "user_id") REFERENCES "dive_logs"("id", "user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "buddy_comments" ADD CONSTRAINT "buddy_comments_buddy_id_fkey" FOREIGN KEY ("buddy_id") REFERENCES "buddies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "guest_buddies" ADD CONSTRAINT "guest_buddies_buddy_id_fkey" FOREIGN KEY ("buddy_id") REFERENCES "buddies"("id") ON DELETE CASCADE ON UPDATE CASCADE;
