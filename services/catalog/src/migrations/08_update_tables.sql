DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'unique_listing_path') THEN
        ALTER TABLE photos ADD CONSTRAINT unique_listing_path UNIQUE(listing_id, path);
     END IF;
END $$;

DO $$
BEGIN
    ALTER TABLE listings DROP CONSTRAINT IF EXISTS check_listing_state;
    ALTER TABLE listings ADD CONSTRAINT check_listing_state
        CHECK (state IN ('pending','reserved', 'sold','cancelled'));
    END $$;

DO $$
BEGIN
    ALTER TABLE transactions DROP COLUMN IF EXISTS state CASCADE;
END $$;

DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'favorites') THEN
        IF EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'wishlists') THEN
            DROP TABLE wishlists; 
        END IF;
        ALTER TABLE favorites RENAME TO wishlists;
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'unique_listing_user') THEN
        ALTER TABLE wishlists ADD CONSTRAINT unique_listing_user UNIQUE(listing_id, user_id);
     END IF;
END $$;


DO $$
BEGIN
    ALTER TABLE reviews DROP COLUMN IF EXISTS seller_id CASCADE;
END $$;


DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'unique_buyer_review') THEN
        ALTER TABLE reviews ADD CONSTRAINT unique_buyer_review UNIQUE(listing_id, buyer_id);
     END IF;
END $$;
