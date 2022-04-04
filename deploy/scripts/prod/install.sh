#!/bin/bash

if ((EUID != 0)); then
    echo "try  $0 $@"
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
   apt-get -y install curl
fi

if [ -z "$(command -v jq)" ]; then
   apt-get -y install jq
fi

if [ -z "$(command -v bc)" ]; then
   apt-get -y install bc
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

base_path=$(readlink -e ".")
cd $base_path

DOCKERHUB_USERNAME="cmsbot"
DOCKERHUB_PASS="uB8V7B6IR5ll"
BITBUCKET_USERNAME="the_dispeakble_one"
BITBUCKET_PASS='KWJtnNGH9Wh9EtAhnSmX'

installService "infrastructure/run-rancher.sh"
installService "infrastructure/install-rancher-cli.sh"
installService "app/launch.sh"

if [ $? != 0 ]; then
   echo
   echo "failed to install"
   exit 1
fi