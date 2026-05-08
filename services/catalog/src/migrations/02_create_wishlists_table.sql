CREATE TABLE IF NOT EXISTS wishlists (
    id SERIAL PRIMARY KEY,
    listing_id UUID REFERENCES listings(id),
    user_id UUID NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT unique_listing_user UNIQUE(listing_id, user_id)
);