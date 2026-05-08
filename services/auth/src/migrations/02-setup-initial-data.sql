INSERT INTO users (id, name, last_names, email, password, location)
VALUES
('5e89669e-5e04-4860-8451-b3b0d2d2a45d', 'Carlos', 'Ruiz Mendoza', 'cruiz@email.com', '$2b$10$CAfdhI4GnyUAbbcxtWEe5OdtaA2Kiusrslvgn76R3aOurOtVn9DJi', ST_SetSRID(ST_Point(2.170604730229544, 41.40647637689663), 4326)),
('7b11d33c-1d0c-4c6e-8e8e-c90a2334f55a', 'Elena', 'Soto Vargas', 'esoto@email.com', '$2b$10$CAfdhI4GnyUAbbcxtWEe5OdtaA2Kiusrslvgn76R3aOurOtVn9DJi', ST_SetSRID(ST_Point(2.113651214731592, 41.35386627754097), 4326)),
('f47ac10b-58cc-4372-a567-0e02b2c3d479', 'Marcos', 'Peña Duarte', 'mpena@email.com', '$2b$10$CAfdhI4GnyUAbbcxtWEe5OdtaA2Kiusrslvgn76R3aOurOtVn9DJi', ST_SetSRID(ST_Point(-3.6819069244237217, 40.449073582342976), 4326)),
('2d931510-3970-47ff-8c3b-2c1f62e666a2', 'Lucía', 'Gómez Pardo', 'lgomez@email.com', '$2b$10$CAfdhI4GnyUAbbcxtWEe5OdtaA2Kiusrslvgn76R3aOurOtVn9DJi', ST_SetSRID(ST_Point(-3.7143852430102227, 40.4319477244714), 4326)),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Javier', 'Rivas Luna', 'jrivas@email.com', '$2b$10$CAfdhI4GnyUAbbcxtWEe5OdtaA2Kiusrslvgn76R3aOurOtVn9DJi', ST_SetSRID(ST_Point(-5.981451020928921, 37.391583458666226), 4326))

ON CONFLICT (id) DO NOTHING;
