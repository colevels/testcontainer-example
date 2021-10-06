# Setup
- Install Node
- Install Docker
- Install yarn
- Create a `.env` based on `.env.example`
- Verify docker compose env vars `docker-compose config`
- Start all docker services declared in `docker-compose.yml`, `docker-compose up`
- Create DB `docker-compose exec mysql-db mysql --verbose -e "source /resources/scripts/create-db.sql" -uroot -proot`

Note: if the DB is corrupted or if it just doesn't work, delete the `mysql-db-data` folder and run `docker-compose up` to recreate the  image.


# Tescontainer

https://www.npmjs.com/package/testcontainers

# Knex Migrations

`npx knex migrate:make migration_task_name` - creates a stub Typescript file in `./migrations` to provide both `up` and `down` migrations.

`npx knex migrate:latest` - run all pending migrations

`npx knex migrate:up` - run the next pending migration

`npx knex migrate:down` - roll back the most recent migration

`npx knex migrate:list` - show current state of migrations.
