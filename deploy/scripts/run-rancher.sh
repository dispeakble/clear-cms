#!/bin/bash -e

APP="Rancher"
APP_VERSION="v2.4.8"
#old_APP_VERSION="v2.3.7"
#APP_VERSION="v2.1.0-rc2"
RANCHER_STORE="/home/dosidoweb/rancher/rancher-store"

    RANCHER_CERTIFICATE="/home/dosidoweb/rancher/ssl/cert.pem"
	RANCHER_CERTIFICATE_KEY="/home/dosidoweb/rancher/ssl/key.pem"
  	RACHER_CERTIFICATE_CA="/home/dosidoweb/rancher/ssl/cacerts.pem"

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

while [ $# -ne 0 ]; do
    arg="$1"
    case "$arg" in
    -h | --help)
        #    *)
        #usage
        exit
        ;;
    --print-app-version)
        echo "${APP_VERSION}"
        exit
        ;;
    --print-docker-images)
        echo "${RANCHER_IMAGE}"
        exit
        ;;
    esac
    shift
done

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
        -v "${RANCHER_CERTIFICATE}":/etc/rancher/ssl/cert.pem \
		-v "${RANCHER_CERTIFICATE_KEY}":/etc/rancher/ssl/key.pem \
        -v "${RACHER_CERTIFICATE_CA}":/etc/rancher/ssl/cacerts.pem \
    	--privileged \
        "${RANCHER_IMAGE}"

    docker run --rm \
        --entrypoint /bin/sh \
        "${RANCHER_IMAGE}" \
        -c 'curl -sSf https://github.com/rancher/kontainer-driver-metadata.git >/dev/null 2>&1 || (echo "Waiting (maximum) 10 minutes for Rancher to get ready..."; sleep 600)'
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
