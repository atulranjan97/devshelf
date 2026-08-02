-- Postgres treats each NULL userId as distinct, so the ItemType_userId_slug_key
-- unique constraint does not enforce uniqueness across the 7 system item types
-- (userId IS NULL). This partial index closes that gap.
CREATE UNIQUE INDEX "ItemType_system_slug_key"
  ON "ItemType" ("slug") WHERE "userId" IS NULL;