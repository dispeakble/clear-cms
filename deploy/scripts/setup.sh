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

installService "cluster-0.0.1/run-rancher.sh"
installService "infrastructure/install-rancher-cli.sh"
installService "cluster-0.0.1/launch.sh"

if [ $? != 0 ]; then
   echo
   echo "failed to install"
   exit 1
fi

exit
