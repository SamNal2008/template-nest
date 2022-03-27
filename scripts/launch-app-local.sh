#! /bin/sh

if sudo lsof -ti:5432 > /dev/null # check if db is up locally
then
echo "DATABASE RUNNING 🏃‍♂️" # && docker-compose up -d app-dev --env-file .env.local
else
echo "DATABASE NOT RUNNING ❌" # && docker-compose up -d app-dev postgres --env-file .env.local
fi