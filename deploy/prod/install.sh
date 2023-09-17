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

DOCKERHUB_USERNAME="dispeakble"
DOCKERHUB_PASS="zF*%d5^nTOwPt$!1"
#BITBUCKET_USERNAME="the_dispeakble_one"
#BITBUCKET_PASS='WrBr1Xh611f9'
BITBUCKET_TOKEN='ATCTT3xFfGN0an_G5MlxpSglB0Logreb9GVvBliWLHcPiwEBCIxLKwz16HdhZ6UfkwRj-RDzaY28nLe7EVrvmdtaJ0Hs7WZLVuhhQ-9ZxdP4DPH0Z-0kJgVTC6v1o_ayEnFRuw6zM5ujwRyAQFGeSxB9N86t1GKTpd75T-xrpNA0llXVnO9bNm0=A3A24FB8'

GITHUB_USERNAME="dispeakble"
GITHUB_PASS='FeGWN3wH6hN5QER'

installService "infrastructure/run-rancher.sh"
installService "infrastructure/install-rancher-cli.sh"
installService "app/launch.sh"

if [ $? != 0 ]; then
   echo
   echo "failed to install"
   exit 1
fi