#!/bin/bash
APP="docker"
APP_BINARY="/usr/bin/docker-compose"
APP_VERSION_FULL="docker-compose version 1.17.1"
APP_VERSION="1.29.2"
FORCE_INSTALL=false

if [ ! -x "$APP_BINARY" ] || [ "$($APP_BINARY version | grep -c $APP_VERSION_FULL)" -le 0 ]; then
    echo "Docker Compose is installing ..."

    sudo curl -L "https://github.com/docker/compose/releases/download/$APP_VERSION/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose

    sudo chmod +x /usr/local/bin/docker-compose

    echo "Docker Compose is installed"
else
    echo "Docker Compose was already installed"
fi
