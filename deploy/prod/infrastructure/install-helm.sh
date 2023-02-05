#!/bin/bash
APP="Helm"
APP_OLD_VERSION="v2"
APP_VERSION="v3.2.4"
APP_BINARY="helm"

if ! which "$APP_BINARY" >/dev/null || [ "$($APP_BINARY version --client | grep -c $APP_OLD_VERSION)" -eq 1 ]; then
    echo "helm v3 was already installed"
    echo "removing cluster roles"
    kubectl delete clusterrolebinding/system
    echo "removed cluster roles"
fi

if ! which "$APP_BINARY" >/dev/null || [ "$($APP_BINARY version --client | grep -c $APP_VERSION)" -le 0 ]; then
    echo "Installing $APP $APP_VERSION..."
    curl -fsSL https://raw.githubusercontent.com/kubernetes/helm/master/scripts/get -o /tmp/hs-installer.sh
    chmod +x /tmp/hs-installer.sh
     /tmp/hs-installer.sh -v "$APP_VERSION"
    rm -f /tmp/hs-installer.sh
    source <(helm completion bash)
    echo "helm v3 installed"
else
    echo "helm is already installed"
fi

helm version
