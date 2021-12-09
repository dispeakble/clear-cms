#!/bin/bash

installService() {
  chmod +x $1
  echo
  echo "install: $1"
  base_path=$(readlink -e "./")
  echo "$base_path/$1"
  source "$base_path/$1"
  if [ $? != 0 ]; then
      echo "error while trying to run: $1"
      exit 1
  fi
}

installService "stop.sh"

docker volume prune -f
rm -fr volumes

installService "setup.sh"