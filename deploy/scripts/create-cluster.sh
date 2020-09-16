#!/bin/bash

STEP_BY_STEP="false"
CMS_PATH="$HOME/cms"
LOGFILE="$CMS_PATH/cms.log"
CMS_file_cluster_config="cluster.json"

RANCHER_URL_FILE="$CMS_PATH/.cmsrancherurl"
RANCHER_TOKEN_FILE="$CMS_PATH/.cmsranchertoken"
CLUSTER_NAME="cms-cluster"
CLUSTER_CREATED="false"   # Flag for Cluster Creation
RANCHER_API_TOKEN="NDY"
RANCHER_SERVER_URL="NDY"
LOCAL_RANCHER_SERVER_URL="https://127.0.0.1:8443"

function usage() {
     echo " Usage: $0 [-m|--min-cluster] [-h|--help]"
}

if ((EUID != 0)); then
    usage
    echo " Please use sudo"
    echo "sudo $0 $@"
    exit
fi

while [ $# -ne 0 ]; do
    arg="$1"
    case "$arg" in
    -h | --help)
        usage
        exit
        ;;
    esac
    shift
done

function log() {
    local PREV_RET_CODE=$?
    echo "$@"
    echo "$(LC_ALL=C date): $@" >>"$LOGFILE"
    if ((PREV_RET_CODE != 0)); then
        return 1
    fi
    return 0
}

function get_outgoing_ip() {
    local ADDR=$(echo $1 | grep -oP '.*://\K([0-9\.]*)') #'
    if [ -z $ADDR ]; then
        ADDR=$1
    fi
    ip route get $ADDR | awk -F"src " 'NR==1{split($2,a," ");print a[1]}'
}

function get_my_ip() {
    local MY_IP="$(get_outgoing_ip 8.8.8.8)"
    if [ -z $MY_IP ]; then
        MY_IP="$(get_outgoing_ip $HTTP_PROXY)"
    fi
    if [ -z $MY_IP ]; then
        MY_IP="$(get_outgoing_ip $http_proxy)"
    fi
    echo $MY_IP
}

log $(get_my_ip)

export no_proxy="localhost,127.0.0.1,0.0.0.0,$(get_my_ip),$no_proxy"

function step() {
    if [ $STEP_BY_STEP = "true" ]; then
        read -p 'Enter to continue...' ENTER
    fi
}

function give_rancher_token() {
    if [ -f $RANCHER_URL_FILE ]; then
       RANCHER_SERVER_URL=$(cat $RANCHER_URL_FILE)
       echo "Found $RANCHER_URL_FILE: $RANCHER_SERVER_URL"
    fi

    if [ -f $RANCHER_TOKEN_FILE ]; then
       RANCHER_API_TOKEN=$(cat $RANCHER_TOKEN_FILE)
       echo "Found $RANCHER_TOKEN_FILE: $RANCHER_API_TOKEN"       
    fi

    LOGINTOKEN=$(curl -k -s 'https://127.0.0.1:8443/v3-public/localProviders/local?action=login' -H 'content-type: application/json' --data-binary '{"username":"the_admin","password":"the_password","ttl":60000}' | jq -r .token)
    if [ "$LOGINTOKEN" = null ]; then
        LOGINTOKEN=$(curl -k -s 'https://127.0.0.1:8443/v3-public/localProviders/local?action=login' -H 'content-type: application/json' --data-binary '{"username":"the_admin","password":"the_password","ttl":60000}' | jq -r .token)
    else
        curl -k -s 'https://127.0.0.1:8443/v3/users?action=changepassword' -H 'Content-Type: application/json' -H "Authorization: Bearer $LOGINTOKEN" --data-binary '{"currentPassword":"the_password","newPassword":"the_password"}'
    fi
    if [ "$LOGINTOKEN" = null ]; then
        return 1
    fi
    RANCHER_API_TOKEN=$(curl -k -s 'https://127.0.0.1:8443/v3/token' -H 'Content-Type: application/json' -H "Authorization: Bearer $LOGINTOKEN" --data-binary '{"type":"token","description":"for installations"}' | jq -r .token)
    echo "API Token: ${RANCHER_API_TOKEN}"
    echo $RANCHER_API_TOKEN >$RANCHER_TOKEN_FILE
    echo "SERVER_URL=$RANCHER_SERVER_URL"
    SERVER_URL_JSN="{\"name\":\"server-url\",\"value\":\"${RANCHER_SERVER_URL}\"}"
    echo $SERVER_URL_JSN
    curl -k 'https://127.0.0.1:8443/v3/settings/server-url' -H 'Content-Type: application/json' -H "Authorization: Bearer $RANCHER_API_TOKEN" -X PUT --data-binary "$SERVER_URL_JSN"
    return 0
}

function await_rancher() {
    if [ -f $RANCHER_URL_FILE ]; then
       RANCHER_SERVER_URL=$(cat $RANCHER_URL_FILE)
       echo "Found $RANCHER_URL_FILE: $RANCHER_SERVER_URL"
    else
       RANCHER_SERVER_URL="https://$(get_my_ip):8443"
       echo $RANCHER_SERVER_URL >$RANCHER_URL_FILE
    fi
    log "Waiting for Rancher: ${RANCHER_SERVER_URL}"
    RANCHER_PONG="NDY"
    wait_count=0
    while [ ! "$RANCHER_PONG" = "pong" ] && ((wait_count < 40)); do
        echo -n "."
        sleep 3
        wait_count=$((wait_count + 1))
        RANCHER_PONG=$(curl -s -k "${RANCHER_SERVER_URL}/ping")
        if [ ! $RANCHER_PONG = "" ]; then
          echo "$RANCHER_PONG"
        fi  
    done
    if [ ! "$RANCHER_PONG" = "pong" ]; then
        log "Error: Cannot Connect to Rancher on: ${RANCHER_SERVER_URL}"
        exit 1
    else
        echo "ok!"
        return 0
    fi
}

function await_rancher_cluster() {
    log "Waiting for cluster state to become active ."
    CLUSTER_STATE=0
    wait_count=0
    while [ "$CLUSTER_STATE" -lt 1 ] && ((wait_count < 60)); do
        echo -n .
        sleep 10
        wait_count=$((wait_count + 1))
        CLUSTER_STATE=$(rancher cluster cms-cluster | grep -c -w active)
    done
    if [ "$CLUSTER_STATE" -lt 1 ]; then
        echo
        log "Error: cluster is not active, please check on Rancher UI."
        exit 1
    fi
    echo "ok!"
    return 0
}

function new_cluster() {

    if [ -z $RANCHER_API_TOKEN ]; then
        echo "It didnt work, please Create Rancher Token from UI"
        read -p 'Enter server URL https://<SERVER_URL>: ' LOCAL_RANCHER_SERVER_URL
        read -p 'Enter server BEARER TOKEN: ' RANCHER_API_TOKEN
    fi

    echo "Rancher login:"
    rancher login --token $RANCHER_API_TOKEN --skip-verify $LOCAL_RANCHER_SERVER_URL
    sleep 5
    echo "Creating the Cluster:"
    rancher cluster create --network-provider flannel --rke-config $CMS_PATH/$CMS_file_cluster_config $CLUSTER_NAME
    rancher context switch
    echo "Rancher login (again):"
    rancher login --token $RANCHER_API_TOKEN --skip-verify $LOCAL_RANCHER_SERVER_URL
    CLUSTER_CREATED="true"
    sleep 5
    echo "Registering node:"
    ADD_NODE_CMD=$(rancher cluster add-node $CLUSTER_NAME | grep docker)
    ROLES_CMD=" --etcd --controlplane --worker"

    if [ -z "${ADD_NODE_CMD}" ]; then
        return 1
    else
        eval $ADD_NODE_CMD$ROLES_CMD
    fi

    await_rancher_cluster

    rancher cluster kf $CLUSTER_NAME >~/.kube/config

    MY_IP=$(get_my_ip)
    sed -i -e "s/127.0.0.1/$MY_IP/g" ~/.kube/config

    return 0
}

function move_namespaces() {
    if [ $(kubectl get namespace | grep elk | grep -c Active) -le 0 ]; then
        kubectl create namespace elk
    fi
    sleep 1
    rancher namespaces move elk Default
    if [ $(kubectl get namespace | grep farm-services | grep -c Active) -le 0 ]; then
        kubectl create namespace farm-services
    fi
    sleep 1
    rancher namespaces move farm-services Default
    if [ $(kubectl get namespace | grep management | grep -c Active) -le 0 ]; then
        kubectl create namespace management
    fi
    sleep 1
    rancher namespaces move management Default
    if [ $(kubectl get namespace | grep proxy | grep -c Active) -le 0 ]; then
        kubectl create namespace proxy
    fi
    sleep 1
    rancher namespaces move proxy Default
    if [ $(kubectl get namespace | grep common | grep -c Active) -le 0 ]; then
        kubectl create namespace common
    fi
    sleep 1
    rancher namespaces move common Default
}

log " [-] Create cluster using rancher cli ..."

await_rancher

step

give_rancher_token

step

new_cluster