#!/bin/bash

echo "Fetching info from github repository"

project_name=$(basename `git rev-parse --show-toplevel`)

green=`tput setaf 2`
reset=`tput sgr0`

echo "Creating new project for :
  ${green}$project_name${reset}"

files_to_update="package*.json"

for file in $files_to_update
do
  if sed -i '' "s/template-nest/$project_name/" $file
    then echo "Changes in $file are made"
    else echo "Changes in $file could not been made"
  fi
done
echo "Done you're ready to go, good programming !  "
