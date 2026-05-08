CREATE TABLE IF NOT EXISTS reviews (
    id SERIAL PRIMARY KEY,
    listing_id UUID REFERENCES listings(id),
    trasaction_id INT REFERENCES transactions(id),
    buyer_id UUID NOT NULL,
    stars SMALLINT NOT NULL,
    review TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT unique_buyer_review UNIQUE(listing_id, buyer_id)
);

