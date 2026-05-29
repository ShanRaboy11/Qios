-- Add legal consent columns to profiles
ALTER TABLE "public"."profiles"
ADD COLUMN IF NOT EXISTS "accepted_tos" BOOLEAN DEFAULT false NOT NULL,
ADD COLUMN IF NOT EXISTS "accepted_privacy" BOOLEAN DEFAULT false NOT NULL;
