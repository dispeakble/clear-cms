#!/bin/bash
RANCHER_CLI="false"
RANCHER_CLI_VERSION="v2.4.10"
CMS_repo_rancher_cli="https://github.com/rancher/cli/releases/download/$RANCHER_CLI_VERSION/rancher-linux-amd64-$RANCHER_CLI_VERSION.tar.xz"
CMS_file_rancher_cli="rancher-linux-amd64-$RANCHER_CLI_VERSION.tar.xz"

function install_rancher_cli() {
    if ! dpkg -s "$1" >/dev/null 2>&1; then
        echo "started install $1"
        apt-get --assume-yes -y install "$1"
    fi
    if ! which rancher >/dev/null; then
        pushd "$(mktemp -d)"
        wget "$CMS_repo_rancher_cli"
        tar xf "$CMS_file_rancher_cli"
        mv rancher-*/rancher /usr/bin/
        rm -rf rancher-*
        popd
    fi
}

install_rancher_cli jq