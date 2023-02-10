echo "Are you sure you want to delete everything ? (y/n)"
read res
if [ $res = 'y' ] || [ $res = 'Y' ]; then
  echo "remove everything" &&
  rm -rf node_modules &&
  docker-compose down &&
  docker rm -f $(docker ps -a -q) &&
  docker volume rm $(docker volume ls -q)
fi
