#! /bin/sh

if [[ 'sudo lsof -ti:5432' ]] # check if db is up locally
then
docker-compose up -d app-dev --env-file .env.local
else
docker-compose up -d app-dev postgres --env-file .env.local
fi