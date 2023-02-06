#!/bin/bash

CMS_NAME="cms-cluster"
CMS_PATH="/home/dosidoweb/cms_app"

#TODO these could be added to a secrets
REDIS_PASSWORD="1gzHwbgfwR"
REDIS_NODE_PORT=31652

PGADMIN_EMAIL="ovidiu.alexa@gmail.com"
PGADMIN_PASSWORD="0MG9DtWxT@t89*6"
PGADMIN_NODEPORT=31080

POSTGRES_USERNAME="cms"
POSTGRES_PASSWORD="0MG9DtWxT@t89*6"
POSTGRES_DB="cms"


if [ -z "$(dpkg --list | grep open-iscsi)" ]; then
  apt-get update
  apt-get install -y open-iscsi
fi


source "${BASH_SOURCE%/*}/rancher-login.sh"

function get_outgoing_ip() {
    local ADDR=$(echo $1 | grep -oP '.*://\K([0-9\.]*)') #'
    if [ -z $ADDR ]; then
        ADDR=$1
    fi
    ip route get $ADDR | awk -F"src " 'NR==1{split($2,a," ");print a[1]}'
}

function get_my_ip() {
    local MY_IP="$(get_outgoing_ip 8.8.8.8)"
    echo $MY_IP
}

function createCluster() {
    sleep 2
    echo "Creating the Cluster $1:"
    rancher cluster create --network-provider flannel --rke-config "${BASH_SOURCE%/*}/config.yaml" $1
    rancherLogin
    sleep 2
    rancher context switch

    sleep 2
    echo "Registering node:"
    ADD_NODE=$(rancher cluster add-node $1 | grep docker)
    ROLES=" --etcd --controlplane --worker"

    echo $ADD_NODE$ROLES

    if [ -z "${ADD_NODE}" ]; then
        return 1
    else
        eval $ADD_NODE$ROLES
    fi

    checkCluster

    rancherLogin

    rancher cluster kf $1 >~/.kube/config

    kubectl create secret docker-registry dockerhub --docker-username=$DOCKERHUB_USERNAME --docker-password="$DOCKERHUB_PASS"

    rancher cluster kf $CLUSTER_NAME >~/.kube/config

    # Replacing localhost IP to real IP
    MY_IP=$(get_my_ip)
    sed -i -e "s/127.0.0.1/$MY_IP/g" ~/.kube/config

    return 0
}

clusterExists() {
  [ "$(rancher cluster ls | grep $1 | awk '{print $3}')" ]
}

function checkCluster() {
    CLUSTER_STATE=0
    wait_count=0
    while [ "$CLUSTER_STATE" -lt 1 ] && ((wait_count < 900)); do
      if [ "$wait_count" -gt 180 ]; then
        echo -en "\rThe cluster is still building... If this message does not go away please contact the administrator"
        else
        echo -en "\rBuilding cluster. $(echo "scale=2; 100 / 180 * $wait_count" | bc)% complete. Time elapsed: $wait_count seconds "
      fi
        sleep 1
        wait_count=$((wait_count + 1))
        CLUSTER_STATE=$(rancher cluster $1 | grep -c -w active)
    done
    if [ "$CLUSTER_STATE" -lt 1 ]; then
        echo "Cluster cannot be detected. Check Rancher UI"
        exit 1
    fi
    echo "\nCluster created!\n"
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
    sleep 3
    waitForApp $1
    return 0;
  fi

  printf '\n' > /dev/tty
}

function waitForApp() {
  if [[ "$(rancher app ls -o yaml)" == *"deploying" ]]; then
    printf '.' > /dev/tty
    sleep 3
    waitForApp $1
    return 0;
  else
    printf "$1 is installed" > /dev/tty
  fi

  printf '\n' > /dev/tty
}

function waitForLonghornStorageClass(){
  echo "$(rancher inspect --type storageClass longhorn | grep default-class)"
  if [[ -z "$(rancher inspect --type storageClass longhorn | grep default-class)" ]]; then
    printf '.' > /dev/tty
    sleep 3
    waitForLonghornStorageClass
    return 0;
  else
    printf "Storage class available" > /dev/tty
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

  waitForCatalog "cattle-global-data:library-longhorn"

  if [ -z "$(getApp longhorn)" ]; then
    rancher app install --no-prompt --namespace longhorn-system \
    --helm-timeout 300 \
    --helm-wait \
    cattle-global-data:library-longhorn longhorn
  fi
  waitForApp "longhorn"
  rancher wait --timeout 300 longhorn
  waitForLonghornStorageClass
  printf '\n' > /dev/tty
}

function checkApp() {
  if [ -z "$(rancher app lt | grep $1)" ]; then
    printf "$1 is not ready yet...\n" > /dev/tty
    sleep 3
    checkApp $1
    return 0;
  fi
  if [ -z "$(rancher app st $1)" ]; then
    printf "$1 found but not loaded yet...\n" > /dev/tty
    sleep 3
    checkApp $1
    return 0;
  fi
  printf "$1 was found\n" > /dev/tty
return 0
}

function addCatalog() {
  if [ -z "$(rancher app lt | grep $1)" ]; then
    echo "adding catalog $1"
    rancher catalog add --helm-version $2 $1 $3 --branch $4
    waitForCatalog $1
  fi
}

function launchRedis() {

  rancher context switch Default
  checkApp "cattle-global-data:bitnami-redis"

  sleep 5

  rancher app install --no-prompt --namespace default \
   --set architecture=standalone \
   --set global.storageClass=longhorn \
   --set master.persistence.size=1Gi \
   --set replica.persistence.size=1Gi \
   --set master.service.type=NodePort \
   --set master.service.nodePort=$REDIS_NODE_PORT \
   --set global.redis.password=$REDIS_PASSWORD \
   --helm-timeout 300 \
   --helm-wait \
   cattle-global-data:bitnami-redis redis
  rancher app show-notes redis

  printf '\n' > /dev/tty
}

function launchCmsApp() {
  #addCatalog "cms-app" "helm_v3" "https://${GITHUB_USERNAME}:${GITHUB_PASS}@github.com/dispeakble/cms-charts.git" "master"
  addCatalog "cms-app" "helm_v3" "https://x-token-auth:${BITBUCKET_TOKEN}@bitbucket.org/the_dispeakble_one/cms-charts.git" "master"

  waitForCatalog "cms-app"

  checkApp "cms"

  waitForApp "redis"
  waitForApp "postgresql"

  rancher app install --no-prompt --namespace default \
   --helm-timeout 300 \
   --helm-wait \
   cattle-global-data:cms-app-cms cms
  rancher app show-notes cms
  waitForApp "cms"
  printf '\n' > /dev/tty
}

function launchPostgreSQL() {

  rancher kubectl create configmap dbconfig --from-file=setup1.sql="${BASH_SOURCE%/*}/../pg.db/db.schema.sql"

  checkApp "cattle-global-data:bitnami-postgresql"

  rancher app install --no-prompt --namespace default \
   --version 8.2.1 \
   --set postgresql.initdbScriptsCM=dbconfig \
   --set global.postgresql.username=$POSTGRES_USERNAME \
   --set global.postgresql.password=$POSTGRES_PASSWORD \
   --set global.postgresql.database=$POSTGRES_DB \
   --set postgresql.repmgrPassword=$POSTGRES_PASSWORD \
   --set pgpool.adminPassword=$POSTGRES_PASSWORD \
   --set global.storageClass=longhorn \
   --helm-timeout 300 \
   --helm-wait \
   cattle-global-data:bitnami-postgresql postgresql
  rancher app show-notes postgresql

  printf '\n' > /dev/tty
}

function launchPGAdmin() {
  addCatalog "runix" "helm_v3" "https://helm.runix.net" "master"

  checkApp "pgadmin4"

   --set extraSecretMounts.name=pgpassfile \
   --set extraSecretMounts.secret=$(awk '{print $1}' "${BASH_SOURCE%/*}/../config/pgadmin4/pgpass.txt") \
   --set extraSecretMounts.mountPath="/var/lib/pgadmin/storage/pgadmin/file.pgpass" \
   --set extraSecretMounts.readOnly=true \
   --set serverDefinitions.enabled=true \
   --set serverDefinitions.servers=$(awk '{print $1}' "${BASH_SOURCE%/*}/../config/pgadmin4/servers.json") \

  rancher app install --no-prompt --namespace default \
   --set env.email=$PGADMIN_EMAIL \
   --set env.password=$PGADMIN_PASSWORD \
   --set global.storageClass=longhorn \
   --set persistentVolume.size=1Gi \
   --set service.type=NodePort \
   --set service.nodePort=$PGADMIN_NODEPORT \
   --helm-timeout 300 \
   --helm-wait \
   cattle-global-data:runix-pgadmin4 pgadmin4
  rancher app show-notes pgadmin4
  printf '\n' > /dev/tty
}

function launchMetalLB(){

createNamespace "metallb-system"
checkApp "cattle-global-data:bitnami-metallb"
sleep 5
sed -e "s|MY_IP_RANGE|127.0.0.230-127.0.0.240/28|g" ${BASH_SOURCE%/*}/configMaps/metallb-system.config.yaml | rancher kubectl apply -f -
rancher app install --no-prompt --namespace metallb-system \
  --set existingConfigMap=metallbconfig \
  --helm-timeout 300 \
  --helm-wait \
  cattle-global-data:bitnami-metallb metallb
}

function launchTraefik(){

  rancher context switch System

  rancher kubectl delete --all pods --namespace=ingress-nginx
  rancher kubectl delete --all deployments --namespace=ingress-nginx
  rancher kubectl delete --all services --namespace=ingress-nginx
  rancher kubectl delete --all daemonsets --namespace=ingress-nginx

  rancher app install --no-prompt --namespace kube-system \
  --helm-timeout 300 \
  --helm-wait \
  cattle-global-data:library-traefik traefik
}

function createNamespace() {
  rancher namespaces create $1
}

function createConfig() {
  rancher kubectl apply -f "configMaps/$1"
}

function createTls() {
  rancher kubectl -n default create secret tls dosidowebcom \
    --cert=${BASH_SOURCE%/*}/../ssl/ssl.cert \
    --key=${BASH_SOURCE%/*}/../ssl/ssl.key
}

sleep 10

rancherForceLogin

createCluster $CMS_NAME
checkCluster $CMS_NAME

sleep 2
rancherLogin
sleep 2
checkCluster $CMS_NAME

sleep 2
launchLonghorn
rancher context switch Default
addCatalog "bitnami" "helm_v3" "https://raw.githubusercontent.com/bitnami/charts/index/bitnami" "main"

#launchMetalLB # TODO LEAVE THIS COMMENTED FOR DEVELOPERS
#launchTraefik # TODO LEAVE THIS COMMENTED FOR DEVELOPERS

launchRedis
launchPostgreSQL
launchPGAdmin
launchCmsApp