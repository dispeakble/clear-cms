#!/bin/bash

if ((EUID != 0)); then
    echo "try sudo $0 $@"
    exit
fi

params="$@"

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
if [ -z "$(command -v curl)" ]; then
  sudo apt-get -y install curl
fi

if [ -z "$(command -v docker)" ]; then
  installService "infrastructure/install-docker.sh"
fi
if [ -z "$(command -v helm)" ]; then
  installService "infrastructure/install-helm.sh"
fi
if [ -z "$(command -v kubectl)" ]; then
  installService "infrastructure/install-kubectl.sh"
fi

DOCKERHUB_USERNAME="cmsbot"
DOCKERHUB_PASS="yTazvEWhtEbk4mv"
BITBUCKET_USERNAME="the_dispeakble_one"
BITBUCKET_PASS="33qsygUp8irSv@E"

sudp apt update
sudo apt upgrade -y

installService "cluster-0.0.1/launch_with_cluster.sh"

if [ $? != 0 ]; then
   echo
   echo "failed to install"
   exit 1
fi

exit
