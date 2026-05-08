CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    last_names VARCHAR(355) NOT NULL,
    email VARCHAR(355) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    has_marketing_consent BOOLEAN DEFAULT false, 
    is_active BOOLEAN DEFAULT true,
    has_accepted_termns BOOLEAN DEFAULT true,
    avatar_url VARCHAR(355),
    conver_photo_url VARCHAR(355),
    location GEOMETRY(POINT) NOT NULL,
    terms_accepted_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);
