
.DEFAULT_GOAL := install_and_start

.PHONY = start deploy clean test first_install build_docker

include .env

renaming_file:
	@echo "Renaming file properly"
	./scripts/new-project.sh

setup_docker_compose: docker-compose.yml
	@echo "Setup for docker-compose"
	docker volume create --name=pg-data

ready: first_install
	@echo "$(date +%s)" >> ready

first_install: renaming_file install build_docker setup_docker_compose

build_docker: Dockerfile
	@echo "Build Dockefile"
	docker build . -t ${APP_NAME}

install: node_modules
	@echo "Installing dependencies ..."

node_modules: package.json
	npm i --save

start: ready
	@echo "Starting the app"
	. ./scripts/launch-app-local.sh

clean:
	@echo "Cleaning up all that mess ... 🗑️"
	@echo "Removing node modules 📁"
	rm -rf node_modules
	@echo "Stoping containers"
	docker-compose stop

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
