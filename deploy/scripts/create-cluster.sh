#!/bin/bash
LOCAL_RANCHER_SERVER_URL="https://127.0.0.1:9443"
CMS_PATH="$HOME/cms_local"
LOGFILE="$CMS_PATH/cms.log"
CMS_file_cluster_config="../cluster/cluster.json"

RANCHER_URL_FILE="$CMS_PATH/.cmsrancherurl"
RANCHER_TOKEN_FILE="$CMS_PATH/.cmsranchertoken"
CLUSTER_NAME="cms-cluster"
CLUSTER_CREATED="false"
RANCHER_API_TOKEN="NDY"
RANCHER_SERVER_URL="NDY"


if ((EUID != 0)); then
    usage
    echo "use sudo"
    echo "sudo $0 $@"
    exit
fi

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

function give_rancher_token() {
    if [ -f $RANCHER_URL_FILE ]; then
       RANCHER_SERVER_URL=$(cat $RANCHER_URL_FILE)
       echo "Found $RANCHER_URL_FILE: $RANCHER_SERVER_URL"
    fi

    if [ -f $RANCHER_TOKEN_FILE ]; then
       RANCHER_API_TOKEN=$(cat $RANCHER_TOKEN_FILE)
       echo "Found $RANCHER_TOKEN_FILE: $RANCHER_API_TOKEN"       
    fi

    LOGINTOKEN=$(curl -k -s 'https://127.0.0.1:9443/v3-public/localProviders/local?action=login' -H 'content-type: application/json' --data-binary '{"username":"admin","password":"1qaz","ttl":60000}' | jq -r .token)
    if [ "$LOGINTOKEN" = null ]; then
        LOGINTOKEN=$(curl -k -s 'https://127.0.0.1:9443/v3-public/localProviders/local?action=login' -H 'content-type: application/json' --data-binary '{"username":"admin","password":"1qaz","ttl":60000}' | jq -r .token)
    else
        curl -k -s 'https://127.0.0.1:9443/v3/users?action=changepassword' -H 'Content-Type: application/json' -H "Authorization: Bearer $LOGINTOKEN" --data-binary '{"currentPassword":"1qaz","newPassword":"1qaz"}'
    fi
    if [ "$LOGINTOKEN" = null ]; then
        return 1
    fi
    RANCHER_API_TOKEN=$(curl -k -s 'https://127.0.0.1:9443/v3/token' -H 'Content-Type: application/json' -H "Authorization: Bearer $LOGINTOKEN" --data-binary '{"type":"token","description":"for installations"}' | jq -r .token)
    echo "API Token: ${RANCHER_API_TOKEN}"
    echo $RANCHER_API_TOKEN >$RANCHER_TOKEN_FILE
    echo "SERVER_URL=$RANCHER_SERVER_URL"
    SERVER_URL_JSN="{\"name\":\"server-url\",\"value\":\"${RANCHER_SERVER_URL}\"}"
    echo $SERVER_URL_JSN
    curl -k 'https://127.0.0.1:9443/v3/settings/server-url' -H 'Content-Type: application/json' -H "Authorization: Bearer $RANCHER_API_TOKEN" -X PUT --data-binary "$SERVER_URL_JSN"
    return 0
}

function await_rancher() {
    if [ -f $RANCHER_URL_FILE ]; then
       RANCHER_SERVER_URL=$(cat $RANCHER_URL_FILE)
       echo "Found $RANCHER_URL_FILE: $RANCHER_SERVER_URL"
    else
       RANCHER_SERVER_URL="https://127.0.0.1:9443"
       echo $RANCHER_SERVER_URL >$RANCHER_URL_FILE
    fi
    echo "Waiting for Rancher: ${RANCHER_SERVER_URL}"
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
        echo "Cannot Connect to Rancher on: ${RANCHER_SERVER_URL}"
        exit 1
    else
        echo "ok!"
        return 0
    fi
}

function await_rancher_cluster() {
    echo "Waiting for cluster state to become active."
    CLUSTER_STATE=0
    wait_count=0
    while [ "$CLUSTER_STATE" -lt 1 ] && ((wait_count < 90)); do
        echo -n .
        sleep 10
        wait_count=$((wait_count + 1))
        CLUSTER_STATE=$(rancher cluster cms-cluster | grep -c -w active)
    done
    if [ "$CLUSTER_STATE" -lt 1 ]; then
        echo
        echo "cluster is not active, please check on Rancher UI."
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
    echo $RANCHER_API_TOKEN
    rancher login --token $RANCHER_API_TOKEN --skip-verify $LOCAL_RANCHER_SERVER_URL
    sleep 1
    echo "Creating the Cluster:"
    rancher cluster create --network-provider flannel --rke-config $CMS_file_cluster_config $CLUSTER_NAME
    rancher context switch
    echo "Rancher login (again):"
    rancher login --token $RANCHER_API_TOKEN --skip-verify $LOCAL_RANCHER_SERVER_URL
    CLUSTER_CREATED="true"
    sleep 1
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

    return 0
}

echo "creating cluster"

await_rancher

give_rancher_token

new_cluster