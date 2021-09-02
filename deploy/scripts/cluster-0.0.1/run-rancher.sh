#!/bin/bash -e

APP="Rancher"
#APP_VERSION="v2.5.7"
APP_VERSION="v2.4.15"
#APP_VERSION="v2.4.8"
#APP_VERSION="v2.3.7"
#APP_VERSION="latest"
RANCHER_STORE="$HOME/rancher/rancher-store"

#ABSOLUTE_PATH=$HOME
ABSOLUTE_PATH="/home/dosidoweb"

#RANCHER_CERTIFICATE="$ABSOLUTE_PATH/rancher/ssl/cert.pem"
#RANCHER_CERTIFICATE_KEY="$ABSOLUTE_PATH/rancher/ssl/key.pem"
#RACHER_CERTIFICATE_CA="$ABSOLUTE_PATH/rancher/ssl/cacerts.pem"

if [ ! -z "$http_proxy" ] && [ -z "$HTTP_PROXY" ]; then
    HTTP_PROXY="$http_proxy"
fi
if [ ! -z "$HTTP_PROXY" ]; then
    RANCHER_PROXY_VARS="-e HTTP_PROXY=${HTTP_PROXY} -e HTTPS_PROXY=${HTTPS_PROXY} -e NO_PROXY=localhost,127.0.0.1,0.0.0.0,${NO_PROXY}"
fi
RANCHER_IMAGE="rancher/rancher:$APP_VERSION"
#RANCHER_IMAGE="rancher/rancher"

function usage() {
    echo " Usage: $0 [-h|--help] [--print-docker-images]"
}

if ! [ -d "$RANCHER_STORE" ]; then
    mkdir -p "$RANCHER_STORE"
fi

if ! ls -1qA "$RANCHER_STORE" | grep -q .; then
    docker run --rm -it \
        -e CATTLE_SYSTEM_CATALOG=bundled \
        -v $RANCHER_STORE:/var-lib-rancher \
        --entrypoint /bin/sh \
        "${RANCHER_IMAGE}" \
        -c "cp -rp /var/lib/rancher/. /var-lib-rancher/"
fi

if [ $(docker ps | grep -c rancher/rancher:) -lt 1 ]; then
    echo
    echo "Running Rancher ($APP_VERSION)"

    docker run -d --restart=always \
        -p 9080:80 \
        -p 9443:443 \
        -v $RANCHER_STORE:/var/lib/rancher \
        --privileged \
        "${RANCHER_IMAGE}"

    docker run --rm \
        --entrypoint /bin/sh \
        "${RANCHER_IMAGE}" \
        -c 'curl -sSf https://github.com/rancher/kontainer-driver-metadata.git >/dev/null 2>&1 || (echo "Waiting (maximum) 10 minutes for Rancher to get ready..."; sleep 600)'

    #while ! curl -k https://localhost:9443/ping; do sleep 10; done
    wait_count=0
    while ! curl -a -k -s https://localhost:9443/ping && ((wait_count < 20)); do
      if [ "$wait_count" -gt 20 ]; then

        echo -en "\r If this message does not go away please contact the administrator"
        else
        echo -en "\rWaiting for Rancher: $(echo "scale=2; 100 / 20 * $wait_count" | bc)% $wait_count seconds - complete"
      fi

        sleep 1
        wait_count=$((wait_count + 1))
    done
else
    echo "Rancher is already running"
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

MY_IP="$(get_my_ip)"
RANCHER_URL="https://$MY_IP:9443"
EXTERNAL_IP="$(curl -s http://whatismyip.akamai.com/ && echo)"

echo " Rancher UI is available on port 9443"
echo $RANCHER_URL
