
.DEFAULT_GOAL := install_and_start

# Regle qui ne sont pas des fichiers
.PHONY = install start deploy clean

install: node_modules
	@echo "Installing dependencies ..."
	touch tmp

node_modules: package.json
	npm i --save

start: install
	@echo "Starting the app"

clean:
	@echo "Cleaning up all that mess ... 🗑️"
	@echo "Removing node modules 📁"
	rm -rf node_modules

deploy:
	@echo "WIP - Deploy 🚀"
