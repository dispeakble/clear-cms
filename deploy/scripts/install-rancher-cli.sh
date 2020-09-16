#!/bin/bash
NOT_FOUND_STR="404: Not Found"
STEP_BY_STEP="false"
CMS_PATH="$HOME/clear-cms"
LOGS="$CMS_PATH/clear-cms.log"
RANCHER_CLI="false"
RANCHER_CLI_VERSION="v2.3.2"
CMS_repo_rancher_cli="https://github.com/rancher/cli/releases/download/$RANCHER_CLI_VERSION/rancher-linux-amd64-$RANCHER_CLI_VERSION.tar.xz"
CMS_file_rancher_cli="rancher-linux-amd64-$RANCHER_CLI_VERSION.tar.xz"
CMS_file_cluster_config="cluster.json"

function usage() {
     echo " Usage : $0 [-h|--help]"
}

if ((EUID != 0)); then
    usage
    echo " run this with root"
    echo "sudo $0 $@"
    exit
fi

function log_string() {
    local PREV_CODE=$?
    echo "$@"
    echo "$(LC_ALL=C date): $@" >>"$LOGS"
    if ((PREV_CODE != 0)); then
        return 1
    fi
    return 0
}

log_string " [-] $0 $@"

function install_if_not_installed() {
    if ! dpkg -s "$1" >/dev/null 2>&1; then
        echo " [-] started install $1"
        apt-get --assume-yes -y install "$1"
    fi
}

function install_rancher_cli() {
    if ! which rancher >/dev/null; then
        pushd "$(mktemp -d)"
        wget "$CMS_repo_rancher_cli"
        tar xf "$CMS_file_rancher_cli"
        mv rancher-*/rancher /usr/bin/
        rm -rf rancher-*
        popd
    fi
}

log_string " installing rancher CLI"

install_if_not_installed jq

install_rancher_cli

log_string " installation complete"