INSERT INTO room_types (id, name) VALUES (gen_random_uuid(), 'SGL') ON CONFLICT (name) DO NOTHING;
INSERT INTO room_types (id, name) VALUES (gen_random_uuid(), 'DBL') ON CONFLICT (name) DO NOTHING;
INSERT INTO room_types (id, name) VALUES (gen_random_uuid(), 'TWIN') ON CONFLICT (name) DO NOTHING;
INSERT INTO room_types (id, name) VALUES (gen_random_uuid(), 'TRPL') ON CONFLICT (name) DO NOTHING;
INSERT INTO room_types (id, name) VALUES (gen_random_uuid(), 'QDPL') ON CONFLICT (name) DO NOTHING;
INSERT INTO room_types (id, name) VALUES (gen_random_uuid(), '5 ADL') ON CONFLICT (name) DO NOTHING;

INSERT INTO nutrition_types (id, name) VALUES (gen_random_uuid(), 'RO') ON CONFLICT (name) DO NOTHING;
INSERT INTO nutrition_types (id, name) VALUES (gen_random_uuid(), 'BB') ON CONFLICT (name) DO NOTHING;
INSERT INTO nutrition_types (id, name) VALUES (gen_random_uuid(), 'HB') ON CONFLICT (name) DO NOTHING;
INSERT INTO nutrition_types (id, name) VALUES (gen_random_uuid(), 'FB') ON CONFLICT (name) DO NOTHING;
INSERT INTO nutrition_types (id, name) VALUES (gen_random_uuid(), 'AI') ON CONFLICT (name) DO NOTHING;
