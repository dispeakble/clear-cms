#!/bin/bash

if ((EUID != 0)); then
    echo "try sudo $0 $@"
    exit
fi

params="$@"

function usage() {
    echo " Usage: $0 [-h|--help] [--print-docker-images]"
}

echo "Hello! Please select your options: "

STORAGE_TYPE="volumes"

echo -e "Type in the storage type: Values = { \n \
      'longhorn': 'this is a storage class cloud application', \n \
      'volumes': 'This method creates the folders before adding them to the docker volume args' \n \
      }; Default: string = 'volumes': $STORAGE_TYPE \n "
read st
[ -n "$st" ] && STORAGE_TYPE=$st

echo "selected storage type: $STORAGE_TYPE"

installService() {
  chmod +x $1
  echo
  echo "install: $1"
  source "./$1"
  if [ $? != 0 ]; then
      echo "error while trying to run: $1"
      exit 1
  fi
}

if [ -z "$(command -v docker)" ]; then
  installService "../infrastructure/install-docker.sh"
fi
if [ -z "$(command -v helm)" ]; then
  installService "../infrastructure/install-helm.sh"
fi
if [ -z "$(command -v kubectl)" ]; then
  installService "../infrastructure/install-kubectl.sh"
fi

DOCKERHUB_USERNAME="cmsbot"
DOCKERHUB_PASS="uB8V7B6IR5ll"
BITBUCKET_USERNAME="the_dispeakble_one"
BITBUCKET_PASS='WrBr1Xh611f9'
DEFAULT_CLUSTER_USERNAME="admin"
DEFAULT_CLUSTER_PASSWORD="1qaz"

installService "./run-rancher.sh"

#echo $(docker logs $(docker ps | grep rancher/rancher | awk '{print $1}'))

#echo $(docker logs $(docker ps | grep rancher/rancher | awk '{print $1}') 2>&1 | grep -i "password:")

#installService "./install-rancher-cli.sh"
installService "./launch.sh"

if [ $? != 0 ]; then
   echo
   echo "failed to install"
   exit 1
fi

exit
