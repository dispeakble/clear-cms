#!/bin/bash
APP="Kubectl"
APP_BIN="kubectl"
FORCE_INSTALL=false

if [ -f /etc/redhat-release ]; then
    OS="RHEL"
else
    OS="Ubuntu"
fi

function usage() {
    echo " Usage: $0 [-f|--force]"
}

while [ $# -ne 0 ]; do
    arg="$1"
    case "$arg" in
    -f | --force)
        FORCE_INSTALL=true
        ;;
    -h | --help)
        usage
        exit
        ;;
    esac
    shift
done

if ! which "$APP_BIN" >/dev/null || [ $FORCE_INSTALL == true ]; then

    if ! [ -d "${HOME}/.kube" ]; then
        mkdir -p "${HOME}/.kube"
        touch "${HOME}/.kube/config"
    fi

    if [[ $OS == "Ubuntu" ]]; then
        sudo apt-get update &&
            sudo apt-get install -y apt-transport-https
        curl -s https://packages.cloud.google.com/apt/doc/apt-key.gpg | sudo apt-key add -
        echo "deb https://apt.kubernetes.io/ kubernetes-xenial main" | sudo tee -a /etc/apt/sources.list.d/kubernetes.list
        sudo apt-get update
        sudo apt-get install -y kubectl
    elif [[ $OS == "RHEL" ]]; then
        sudo tee -a /etc/yum.repos.d/kubernetes.repo <<EOF
[kubernetes]
name=Kubernetes
baseurl=https://packages.cloud.google.com/yum/repos/kubernetes-el7-x86_64
enabled=1
gpgcheck=1
repo_gpgcheck=1
gpgkey=https://packages.cloud.google.com/yum/doc/yum-key.gpg https://packages.cloud.google.com/yum/doc/rpm-package-key.gpg
EOF
        sudo yum install -y kubectl
    fi

    source <(kubectl completion bash)
    echo "done"

    kubectl version --short --client

else
    echo "$APP was previously installed"
    kubectl version --short --client
fi
