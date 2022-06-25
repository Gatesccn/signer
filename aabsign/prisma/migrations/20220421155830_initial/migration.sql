-- CreateTable
CREATE TABLE "Queue" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "message_id" INTEGER NOT NULL,
    "chat_id" INTEGER NOT NULL,
    "filename" TEXT,
    "file_unique_id" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Running" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "on_queue" BOOLEAN NOT NULL
);
