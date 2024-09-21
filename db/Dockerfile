FROM mongo:latest

COPY ./init_db.js /docker-entrypoint-initdb.d/
EXPOSE ${DB_PORT}:27017