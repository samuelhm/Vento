CREATE TABLE IF NOT EXISTS listing_categories (
    id SERIAL PRIMARY KEY,
    listing_id UUID REFERENCES listings(id) UNIQUE,
    categorie_id INT REFERENCES categories(id)
);
