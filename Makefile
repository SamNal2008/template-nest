
.DEFAULT_GOAL := start

.PHONY: start deploy clean postgres-start redis-start renaming_file setup_docker_compose first_install install copy_template stop test stack-up

include .env

########################################
############# DOCKER UTILS #############
########################################

stack-up:
	@echo "Lets launch everything"
	docker-compose up -d redis redis-commander postgres sonarqube

redis-start:
	@echo "Warming up docker compose"
	docker-compose up -d redis redis-commander

postgres-start:
	@echo "Starting database"
	docker-compose up -d postgres

sonar-start:
	@echo "Starting sonar"
	docker-compose up -d sonarqube

#########################################
############# FIRST INSTALL #############
#########################################

renaming_file:
	@echo "Renaming file properly"
	./scripts/templates/new-project.sh

setup_docker_compose: docker-compose.yml
	@echo "Setup for docker-compose"
	docker volume create --name=pg-data

first_install: setup_docker_compose postgres-start redis-start start

copy_template: renaming_file install build_docker setup_docker_compose

#######################################
############# NODE UTILS ##############
#######################################

test: node_modules
	npm test

node_modules: package.json
	npm install

######################################
############# APP UTILS ##############
######################################


start: node_modules stack-up
	docker-compose up -d app-dev

build_docker: Dockerfile
	docker build . -t ${APP_NAME}

stop:
	docker-compose down

clean:
	./scripts/templates/clear-project.sh

########################################
############# INFRA UTILS ##############
########################################

full_clean: clean
	@echo "Are you sure you want to remove everything ? (Y/n)"
	@read res
	@if [ res = "y" ]; then \
		@echo "Removing everything installed"
		docker-compose down && \
		docker rm -f $(docker ps -a -q) && \
		docker volume rm $(docker volume ls -q) && \
	fi



deploy: build_docker
	@echo "WIP - Deploy 🚀"

terraform-test:
	@echo "WIP - Infra 🚀"

##########################################
############# QUALITY UTILS ##############
##########################################

run-sonar-analysis: sonar-start
	./scripts/quality/sonar.sh ${SONAR_TOKEN}
