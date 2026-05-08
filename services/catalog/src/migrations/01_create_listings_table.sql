CREATE TABLE IF NOT EXISTS listings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    price NUMERIC(15,2) NOT NULL,
    state TEXT NOT NULL DEFAULT 'pending',
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    location GEOMETRY(POINT) NOT NULL,
    
    CONSTRAINT check_listing_state
    CHECK (state IN ('pending','reserved', 'sold','cancelled'))
);

CREATE INDEX IF NOT EXISTS idx_listings_search_spanish
ON listings
USING GIN(to_tsvector('spanish', coalesce(title,'') || ' ' || coalesce(description,'')))
