CREATE TABLE IF NOT EXISTS photos (
    id SERIAL NOT NULL,
    listing_id UUID REFERENCES listings(id),
    path VARCHAR(355) NOT NULL,
    position SMALLINT NOT NULL,

    CONSTRAINT unique_listing_photo_order UNIQUE(listing_id, position),
    CONSTRAINT unique_listing_path UNIQUE(listing_id, path)
);
