# Book-store Api

## Stack

- [Docker](https://www.docker.com/get-started/) - Development container management system
- [NestJS](https://www.nestjs.com) - TypeScript API framework with TypeORM
- [TypeScript](https://www.typescript.org) - Strongly typed JavaScript superset
- [PostgreSQL](https://www.postgresql.org/) - Relational database system

### Docker

Docker Compose is used to manage the developer dependencies in containers, eliminating the need for local installations.

`````sh
# Start the containers
docker-compose up [NAMES?]

# Attach to a running container
docker-compose exec [NAME] sh

# Stop all running containers
docker stop $(docker container ls -q)

### Database

#### Migrations

TypeORM provides a migration CLI (_wrapped with scripts_) to handle generating new migrations and managing the status of existing migrations.

````sh
# Attach to the running API container
docker-compose exec main sh

# Run outstanding migrations
$ npm run migratrion:run

# Generate a new migration (after schema changes, etc)
$ npm run migration:generate -- -n [MIGRATION_NAME]

#### Connecting to Container

Connecting to the postgres database can be done either through a db tool (such as DBeaver) or Docker Compose. If connecting through an external database tool, use the database credentials defined in the root `.env` file.
`````
