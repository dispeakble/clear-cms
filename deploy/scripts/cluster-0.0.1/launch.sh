#!/bin/bash
#TODO install rancher cli from net

CMS_NAME="cms-cluster"
CMS_PATH="$HOME/cms_app"

source ./rancher-login.sh

function createCluster() {
    echo "Creating the Cluster $1:"
    rancher context switch
    rancher cluster create --network-provider flannel --rke-config ./config.yaml $1
    rancherLogin

    sleep 5
    echo "Registering node:"
    ADD_NODE_CMD=$(rancher cluster add-node $1 | grep docker)
    ROLES_CMD=" --etcd --controlplane --worker --net=host"

    echo "$ADD_NODE_CMD$ROLES_CMD"
    eval $ADD_NODE_CMD$ROLES_CMD

    checkCluster

    rancher cluster kf $1 >~/.kube/config

    kubectl create secret docker-registry dockerhub --docker-username=dispeakble --docker-password=pasarela

    return 0
}

clusterExists() {
  [ "$(rancher cluster ls | grep $1 | awk '{print $3}')" ]
}

function checkCluster() {
    echo "Checking cluster state"
    CLUSTER_STATE=0
    wait_count=0
    while [ "$CLUSTER_STATE" -lt 1 ] && ((wait_count < 90)); do
        echo -n .
        sleep 10
        wait_count=$((wait_count + 1))
        CLUSTER_STATE=$(rancher cluster $1 | grep -c -w active)
    done
    if [ "$CLUSTER_STATE" -lt 1 ]; then
        echo "Cluster cannot be detected. Check Rancher UI"
        exit 1
    fi
    echo "ok!"
    return 0
}

function getNamespace() {
  echo $(rancher namespace ls | grep $1)
}

function getApp() {
  echo $(rancher app ls | grep $1)
}

function waitForCatalog() {
  if [[ "$(rancher catalog ls -v | grep $1 | awk '{print $7}')" = "active" ]]; then
    printf "$1 is installed" > /dev/tty
    sleep 3
  else
    printf '.' > /dev/tty
    sleep 5
    waitForApp $1
    return 0;
  fi

  printf '\n' > /dev/tty
}

function waitForApp() {
  if [[ "$(rancher app ls -o yaml | grep $1)" == *"deploying" ]]; then
    printf '.' > /dev/tty
    sleep 5
    waitForApp $1
    return 0;
  else
    printf "$1 is installed" > /dev/tty
  fi

  printf '\n' > /dev/tty
}



function launchLonghorn () {
  echo '--------'
  echo "$(rancher project ls | grep Storage)"
  echo '--------'
  if [ -z "$(rancher project ls | grep Storage)" ]; then
    echo "Creating the Storage project"
    rancher project create Storage
  fi

  rancher context switch Storage
  sleep 1
  if [ -z "$(rancher namespace ls | grep longhorn-system)" ]; then
    echo "$(rancher namespace ls | grep longhorn-system)"
    echo "Creating Storage:longhorn-system namespace"
    rancher namespace create longhorn-system
  fi

  if [ -z "$(getApp longhorn)" ]; then
    rancher app install --version 1.0.2 --no-prompt --namespace longhorn-system cattle-global-data:library-longhorn longhorn
  fi
  waitForApp "longhorn"
}

function checkApp() {
  echo "$(rancher app lt | grep $1)"
  if [ -z "$(rancher app lt | grep $1)" ]; then
    printf "$1 is not ready yet...\n" > /dev/tty
    sleep 5
    checkApp $1
    return 0;
  fi

  printf "$1 was found\n" > /dev/tty
return 0
}

function addCatalog() {
  echo "rancher catalog add --helm-version $2 $1 $3"
  echo "rancher app lt | grep $1"
  if [ -z "$(rancher app lt | grep $1)" ]; then
    echo "adding catalog $1"
    echo "rancher catalog add --helm-version $2 $1 $3"
    rancher catalog add --helm-version $2 $1 $3
    waitForCatalog $1
  fi
}

function launchRedis() {
  rancher context switch Default

  addCatalog "bitnami" "helm_v3" "https://charts.bitnami.com/bitnami"

  checkApp "bitnami-redis"

  rancher app install --no-prompt --namespace default \
   --set cluster.enabled=false \
   --set storageClass=longhorn \
   --set service.type=NodePort \
   --set service.NodePort=30637 \
   --helm-timeout 300 \
   cattle-global-data:bitnami-redis redis
  rancher app show-notes redis
  waitForApp "redis"
  printf '\n' > /dev/tty
}

rancherForceLogin

clusterExists $CMS_NAME || createCluster $CMS_NAME
checkCluster $CMS_NAME

sleep 15

rancherLogin

launchLonghorn
sleep 15

launchRedis