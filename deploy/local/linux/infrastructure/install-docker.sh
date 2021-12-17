#!/bin/bash
APP="docker"
APP_BINARY="/usr/bin/docker"
APP_VERSION="20.10.6"
FORCE_INSTALL=false

if [ ! -x "$APP_BINARY" ] || [ "$($APP_BINARY version | grep -c $APP_VERSION)" -le 0 ]; then
    echo "Docker is installing ..."
    curl -LJ --progress-bar https://releases.rancher.com/install-docker/$APP_VERSION.sh | sh
    sudo systemctl enable docker
    sudo systemctl start docker
    sudo usermod -aG docker $USER
    newgrp docker
    echo "Docker is installed"
else
    echo "Docker was already installed"
fi
