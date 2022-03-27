#! /bin/sh

if sudo lsof -ti:5432 > /dev/null # check if db is up locally
  then
    echo "DATABASE RUNNING 🏃‍♂️" && docker-compose up -d app-dev
  else
    echo "DATABASE NOT RUNNING ❌" && docker-compose up -d app-dev postgres
fi