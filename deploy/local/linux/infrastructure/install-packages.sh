#!/bin/bash

installNpmPackages() {

  if [ ! -d "$1/node_modules" ]; then
    cd $1 && npm install
  fi

}

installYarnPackages() {

  if [ ! -d "$1/node_modules" ]; then
    sudo npm i -g yarn
    cd $1 && yarn install
  fi

}

base_path=$(readlink -e "../../../")

installYarnPackages "$base_path/core/frontend/proxy"
installYarnPackages "$base_path/core/hub/api"
installYarnPackages "$base_path/core/proxy/api"
installYarnPackages "$base_path/core/system/api"
installYarnPackages "$base_path/plugins/dosido/bucket/api"
installYarnPackages "$base_path/plugins/dosido/db/api"

installYarnPackages "$base_path/core/system/client"
installYarnPackages "$base_path/core/frontend/api/"