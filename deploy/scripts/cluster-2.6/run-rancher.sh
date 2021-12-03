#!/bin/bash -e

RANCHER_DOMAIN="fakeclient.local"
RANCHER_URL="https://$RANCHER_DOMAIN:9443"
APP="Rancher"
#APP_VERSION="v2.5.7"
#APP_VERSION="v2.4.15"
#APP_VERSION="v2.4.8"
#APP_VERSION="v2.3.7"
APP_VERSION="v2.6.0"
#APP_VERSION="v2.6.1"
RANCHER_STORE="/opt/rancher"

ABSOLUTE_PATH=$HOME
#ABSOLUTE_PATH="/home/dosidoweb"

#RANCHER_CERTIFICATE="$ABSOLUTE_PATH/rancher/ssl/cert.pem"
#RANCHER_CERTIFICATE_KEY="$ABSOLUTE_PATH/rancher/ssl/key.pem"
#RACHER_CERTIFICATE_CA="$ABSOLUTE_PATH/rancher/ssl/cacerts.pem"
#
#if [ ! -z "$http_proxy" ] && [ -z "$HTTP_PROXY" ]; then
#    HTTP_PROXY="$http_proxy"
#fi
#if [ ! -z "$HTTP_PROXY" ]; then
#    RANCHER_PROXY_VARS="-e HTTP_PROXY=${HTTP_PROXY} -e HTTPS_PROXY=${HTTPS_PROXY} -e NO_PROXY=fakeclient.local,127.0.0.1,0.0.0.0,${NO_PROXY}"
#fi
RANCHER_IMAGE="rancher/rancher:$APP_VERSION"
#RANCHER_IMAGE="rancher/rancher"


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


if ! [ -d "$RANCHER_STORE" ]; then
    mkdir -p "$RANCHER_STORE"
fi

#if ! ls -1qA "$RANCHER_STORE" | grep -q .; then
#    docker run --rm -it \
#        -e CATTLE_SYSTEM_CATALOG=bundled \
#        -v $RANCHER_STORE:/var-lib-rancher \
#        --entrypoint /bin/sh \
#        "${RANCHER_IMAGE}" \
#        -c "cp -rp /var/lib/rancher/. /var-lib-rancher/"
#fi

if [ $(docker ps | grep -c rancher/rancher:) -lt 1 ]; then
    echo
    echo "Running Rancher ($APP_VERSION)"

    mkdir -p /host/proc/1/ns/mnt
    mkdir -p /host/proc/1/ns/net

    if [ $STORAGE_TYPE == "volumes" ]; then
        docker run -d --restart=always \
        -p 9080:80 \
        -p 9443:443 \
        -v $RANCHER_STORE:/var/lib/rancher \
        --privileged \
        "${RANCHER_IMAGE}"
    else
        #-v /var/lib/longhorn:/var/lib/longhorn:shared \
        #-v /tmp:/tmp:shared \
        docker run -d --restart=always \
        -p 9080:80 \
        -p 9443:443 \
        -v $RANCHER_STORE:/var/lib/rancher \
        --privileged \
        "${RANCHER_IMAGE}"
    fi

    wait_count=0
    total_seconds=30
    while ! curl --proxy-insecure -a -k -s "https://$RANCHER_DOMAIN:9443" && ((wait_count < total_seconds)); do
      if [ "$wait_count" -gt $total_seconds ]; then
          echo -en "\r If this message does not go away please contact the administrator"
        else
          echo -en "\rWaiting for Rancher: $(printf %.2f $(echo "$wait_count/$total_seconds*100" | bc -l))% $wait_count seconds - complete"
      fi

        sleep 1
        wait_count=$((wait_count + 1))
    done
else
    echo "Rancher is already running"
fi

echo
echo '----'
echo

MY_IP="$(get_my_ip)"

echo
echo '----'
echo

EXTERNAL_IP="$(curl --proxy-insecure -s http://whatismyip.akamai.com/ && echo)"

echo
echo '----'
echo

echo " Rancher UI is available on port 9443"
echo $RANCHER_URL

echo
echo '----'
echo

