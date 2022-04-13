\i '/docker-entrypoint-initdb.d/tables/users.sql'
\i '/docker-entrypoint-initdb.d/tables/login.sql'

-- Seeding data
\i '/docker-entrypoint-initdb.d/seed/seed.sql'
