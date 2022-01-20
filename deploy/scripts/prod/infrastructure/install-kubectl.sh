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

if ! which "$APP_BIN" >/dev/null; then

    if ! [ -d "${HOME}/.kube" ]; then
        mkdir -p "${HOME}/.kube"
        touch "${HOME}/.kube/config"
    fi

    if [[ $OS == "Ubuntu" ]]; then
         apt-get update &&
             apt-get install -y apt-transport-https
        curl -s https://packages.cloud.google.com/apt/doc/apt-key.gpg |  apt-key add -
        echo "deb https://apt.kubernetes.io/ kubernetes-xenial main" |  tee -a /etc/apt/sources.list.d/kubernetes.list
         apt-get update
         apt-get install -y kubectl
    elif [[ $OS == "RHEL" ]]; then
         tee -a /etc/yum.repos.d/kubernetes.repo <<EOF
[kubernetes]
name=Kubernetes
baseurl=https://packages.cloud.google.com/yum/repos/kubernetes-el7-x86_64
enabled=1
gpgcheck=1
repo_gpgcheck=1
gpgkey=https://packages.cloud.google.com/yum/doc/yum-key.gpg https://packages.cloud.google.com/yum/doc/rpm-package-key.gpg
EOF
         yum install -y kubectl
    fi

    source <(kubectl completion bash)
    echo "done"

    kubectl version --short --client

else
    echo "$APP was already installed"
    kubectl version --short --client
fi
