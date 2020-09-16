#!/bin/bash
APP="Helm"
APP_OLD_VERSION="v2"
APP_VERSION="v3.2.4"
APP_BIN="helm"
FORCE_INSTALL=false

function usage() {
    echo " Usage : $0 [-f|--force] [-h|--help]"
}

while [ $# -ne 0 ]; do
    arg="$1"
    case "$arg" in
    -f | --force)
        FORCE_INSTALL=true
        ;;
    --print-app-version)
        echo "${APP_VERSION}"
        exit
        ;;
    --print-docker-images)
        exit
        ;;
    -h | --help)
        #    *)
        usage
        exit
        ;;
    esac
    shift
done

if ! which "$APP_BIN" >/dev/null || [ "$($APP_BIN version --client | grep -c $APP_OLD_VERSION)" -eq 1 ]; then
    echo "Helm v2 is installed"
    echo "Removing cluster roles"
    kubectl delete clusterrolebinding/system
    echo "Done Removing cluster roles"
fi

if ! which "$APP_BIN" >/dev/null || [ "$($APP_BIN version --client | grep -c $APP_VERSION)" -le 0 ] || [ $FORCE_INSTALL == true ]; then
    echo "Installing $APP $APP_VERSION..."
    curl -fsSL https://raw.githubusercontent.com/kubernetes/helm/master/scripts/get -o /tmp/helm_script.sh
    chmod +x /tmp/helm_script.sh
    sudo /tmp/helm_script.sh -v "$APP_VERSION"
    rm -f /tmp/helm_script.sh
    source <(helm completion bash)
    echo "Helm installed"
else
    echo "$APP is already installed"
fi

$APP_BIN version
