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
if [ -z "$(command -v node)" ]; then
  installService "infrastructure/install-nodejs.sh"
fi

base_path=$(readlink -e ".")
cd $base_path

DOCKERHUB_USERNAME="cmsbot"
DOCKERHUB_PASS="uB8V7B6IR5ll"
BITBUCKET_USERNAME="the_dispeakble_one"
BITBUCKET_PASS='3!mV11JPhaxh'

#DOCKERHUB_CRED_FILE=./dockerhub_credentials.txt
#if [[ -f "$DOCKERHUB_CRED_FILE" ]]; then
#    echo "$DOCKERHUB_CRED_FILE exists."
#    DOCKERHUB_USERNAME=$(awk '{print $1}' ./$DOCKERHUB_CRED_FILE)
#    DOCKERHUB_PASS=$(awk '{print $2}' ./$DOCKERHUB_CRED_FILE)
#else
#  read -p 'Dockerhub Username: ' DOCKERHUB_USERNAME
#  echo -n "$DOCKERHUB_USERNAME" >> $DOCKERHUB_CRED_FILE
#  read -sp 'Dockerhub Password: ' DOCKERHUB_PASS
# echo -n " $DOCKERHUB_PASS" >> $DOCKERHUB_CRED_FILE
#  chown 1000:1000 $DOCKERHUB_CRED_FILE
#  printf '\nDockerhub credentials received\n' > /dev/tty
#fi

#BITBUCKET_CRED_FILE=./bitbucket_credentials.txt
#if [[ -f "$BITBUCKET_CRED_FILE" ]]; then
#   echo "$BITBUCKET_CRED_FILE exists."
#   BITBUCKET_USERNAME=$(awk '{print $1}' ./$BITBUCKET_CRED_FILE)
#   BITBUCKET_PASS=$(awk '{print $2}' ./$BITBUCKET_CRED_FILE)
#else
#  read -p 'Bitbucket Username: ' BITBUCKET_USERNAME
#  echo -n "$BITBUCKET_USERNAME" >> $BITBUCKET_CRED_FILE
#  read -sp 'Bitbucket Password: ' BITBUCKET_PASS
#  echo -n " $BITBUCKET_PASS" >> $BITBUCKET_CRED_FILE
#  printf '\nBitbucket credentials received\n' > /dev/tty
#  chown 1000:1000 $BITBUCKET_CRED_FILE
#fi

#echo "Dockerhub username: $DOCKERHUB_USERNAME"
#echo "Bitbucket username: $BITBUCKET_USERNAME"

installService "cluster-0.0.1/run-rancher.sh"
installService "infrastructure/install-rancher-cli.sh"
installService "cluster-0.0.1/launch.sh"

if [ $? != 0 ]; then
   echo
   echo "failed to install"
   exit 1
fi