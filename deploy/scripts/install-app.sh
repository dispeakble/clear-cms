#!/bin/bash
CMS_PATH="$HOME/cms"
NOT_FOUND_STR="404: Not Found"
LOGFILE="$CMS_PATH/cms.log"
CMS_file_docker="install-docker.sh"
DOCKER_USER="cms1"
PASSWORD=""
DOCKER_LOGIN_FILE="$HOME/.docker/config.json"
VERSION="latest"
CMS_VERSION_FILE="$CMS_PATH/.cmsver"
CMS_file_install_cms_local="install-app-local.sh"

function usage() {
    if ! [[ $0 != "$BASH_SOURCE" ]]; then
      CMD=$(ps -o comm= $PPID)
     else
      CMD=$0 
    fi
    echo
    echo " Usage: "
    echo "$CMD -p <PASSWORD> [-v|--version <version-name>] [-r|--releases] [-n|--namespace <NAMESPACE> (<NAMESPACE>)] [-l|--label] [-h|--help]"

    if [ "-$1" = "-h" ]; then
        echo
        echo "   -p <PASSWORD>        the password for the docker registry"
        echo "   -v                   Install a specific version"
        echo "   -n <NS> [NS]         Install specific Namespace(s)"
        echo "                        Namespaces: [optional]"
        echo "   -l                   Set Label(s) on the node"
        echo "   -h                   Display this message"
    fi
    echo
}

if ((EUID != 0)); then
    usage
    echo " Please run it as root"
    echo "sudo $0 $@"
    exit
fi

if [ ! -d $CMS_PATH ]; then
    mkdir -p $CMS_PATH
    chmod 0755 $CMS_PATH
fi

cd "$CMS_PATH" || exit 1

function log_message() {
    local PREV_RET_CODE=$?
    echo " [-] $@"
    if [ -f "$LOGFILE" ]; then
        echo "$(LC_ALL=C date): $@" >>"$LOGFILE"
        if ((PREV_RET_CODE != 0)); then
            return 1
        fi
    fi
    return 0
}
log_message " [-] $0 $@"

args="$@"

while [ $# -ne 0 ]; do
    arg="$1"
    case "$arg" in
    -p | --password)
        shift
        PASSWORD="$1"
        ;;
    -v | --version)
        shift
        echo -n "$1" >"$CMS_VERSION_FILE"
        ;;
    -h | --help)
        #    *)
        usage "h"
        exit
        ;;
    esac
    shift
done

if [ -f "$CMS_VERSION_FILE" ]; then
    VERSION=$(cat "$CMS_VERSION_FILE")
fi

echo "Version:" "$VERSION"

if [ "$PASSWORD" == "" ]; then
    if ! [ -f  $DOCKER_LOGIN_FILE ] || [ $(grep -c auth $DOCKER_LOGIN_FILE) -lt 1 ]; then
      echo " Error: Password is missing"
      usage
      exit 1
     else
      echo "Already logged in"
   fi
fi

function docker_login() {
    if ! [ -f  $DOCKER_LOGIN_FILE ] || [ $(grep -c auth $DOCKER_LOGIN_FILE) -lt 1 ]; then
        echo "docker login" $DOCKER_USER
        echo "$PASSWORD" | docker login --username=$DOCKER_USER --password-stdin
        if [ $? == 0 ]; then
            echo "Logged in to docker hub"
        else
            log_message "Failed to login to docker hub"
            exit -1
        fi
    fi
}

if [ ! -x "/usr/bin/docker" ]; then
    source "./$CMS_file_docker"
    if [ $? != 0 ]; then
        log_message " [-] $CMS_file_docker failed"
        exit 1
    fi
fi

DOCKER_GID=$(getent group docker | awk -F: '{print $3}')

docker_login


export PATH="/usr/local/bin:$PATH"

cd "$CMS_PATH"

"./$CMS_file_install_cms_local" $args
