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

installService "infrastructure/install-docker.sh"
installService "infrastructure/install-kubectl.sh"
installService "infrastructure/install-helm.sh"
installService "infrastructure/install-rancher-cli.sh"
installService "run-rancher.sh"
installService "cluster-0.0.1/rancher-login.sh"
installService "cluster-0.0.1/launch.sh"

if [ $? != 0 ]; then
   echo
   echo "failed to install"
   exit 1
fi

exit
