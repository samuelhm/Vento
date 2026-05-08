CREATE TABLE IF NOT EXISTS transactions (
    id SERIAL PRIMARY KEY,
    listing_id UUID REFERENCES listings(id),
    buyer_id UUID NOT NULL,
    seller_id UUID NOT NULL,
    price NUMERIC(15,2) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
)