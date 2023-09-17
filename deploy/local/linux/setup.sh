#!/bin/bash

if [ -z "$(lscpu | grep VT-x)" ]; then
  printf "Cannot continue because no Virtualization was found\n" > /dev/tty
  return 1;
else
  printf "Virtualization was found\n" > /dev/tty
fi

promptText() {
  read -p "$1" text
  echo $text
}

promptSecret() {
  read -s -p "$1" password
  echo $password
}

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

if [ -z "$(command -v node)" ]; then
  echo "Installing NodeJs"
  installService "./infrastructure/install-nodejs.sh"
fi

if [ -z "$(command -v docker)" ]; then
  echo "Installing Docker"
  installService "./infrastructure/install-docker.sh"
fi

if [ -z "$(command -v docker-compose)" ]; then
  echo "Installing Docker Compose"
  installService "./infrastructure/install-docker-compose.sh"
fi

if [ -z "$(command -v jq)" ]; then
  echo "Installing JQ"
  sudo apt-get -y install jq
fi

if [ -z "$(command -v bc)" ]; then
  echo "Installing BC"
  sudo apt-get -y install bc
fi

echo "Login in to docker"

cat ../secrets/dockerpass.txt | docker login --username dispeakble --password-stdin

echo "Creating volume folders"

mkdir -p ./volumes/postgres
mkdir -p ./volumes/pgadmin/sessions

chown 500:500 -R ./volumes/pgadmin

#mkdir -p ./volumes/cms/bucket

echo "Installing NodeJs packages"
installService "./infrastructure/install-packages.sh"

base_path=$(readlink -e ".")
cd $base_path

echo -e "\n"
echo -e "\n"

echo "**************** Starting Installation *****************"

echo -e "\n"

source "./start.sh"

echo -e "\n"

echo "**************** Finished Installation *****************"

if [ $? != 0 ]; then
   echo
   echo "failed to install"
   exit 1
fi