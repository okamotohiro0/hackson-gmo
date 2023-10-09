DOCKER_COMPOSE := docker compose

# run: up migrate/up

up:
	$(DOCKER_COMPOSE) up -d

build:
	$(DOCKER_COMPOSE) build

build-no-cache:
	$(DOCKER_COMPOSE) build --no-cache

down:
	$(DOCKER_COMPOSE) down --volumes --remove-orphans --rmi local

logs:
	$(DOCKER_COMPOSE) logs -f

DATABASE_NAME := postgres-db
DATABASE      := postgres
psql:
	$(DOCKER_COMPOSE) exec -it $(DATABASE_NAME) psql -U $(DATABASE)



# GOOSE_DRIVER   := postgres
# GOOSE_DBSTRING ?= host=db user=root dbname=treasure_app password=p@ssword sslmode=disable
# migrate/status:
# 	$(DOCKER_COMPOSE) run --rm migration status

# VERSION:=$(shell ls db/migration | awk -F"_*.sql" 'BEGIN {max=0} {split($$1, a, "_"); if(a[1]>max){max = a[1]}}END{print max+1}')
# TEMPLATE?=
# migrate/new:
# 	echo '-- +goose Up' > db/migration/${VERSION}_${TEMPLATE}.sql

# migrate/up:
# 	$(DOCKER_COMPOSE) run --rm migration up
