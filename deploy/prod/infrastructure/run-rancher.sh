#!/bin/bash -e

APP="Rancher"
#APP_VERSION="v2.5.7"
APP_VERSION="v2.4.15"
#APP_VERSION="v2.4.8"
#APP_VERSION="v2.3.7"
#APP_VERSION="latest"
RANCHER_STORE="/home/dosidoweb/rancher/rancher-store"

#ABSOLUTE_PATH="$HOME"
ABSOLUTE_PATH="/home/dosidoweb"

RANCHER_CERTIFICATE="$ABSOLUTE_PATH/deploy/prod/ssl/ssl.cert"
RANCHER_CERTIFICATE_KEY="$ABSOLUTE_PATH/deploy/prod/ssl/ssl.key"
RACHER_CERTIFICATE_CA="$ABSOLUTE_PATH/deploy/prod/ssl/ssl.ca"

if [ ! -z "$http_proxy" ] && [ -z "$HTTP_PROXY" ]; then
    HTTP_PROXY="$http_proxy"
fi
if [ ! -z "$HTTP_PROXY" ]; then
    RANCHER_PROXY_VARS="-e HTTP_PROXY=${HTTP_PROXY} -e HTTPS_PROXY=${HTTPS_PROXY} -e NO_PROXY=dosidoweb.com,188.214.30.235,localhost,127.0.0.1,0.0.0.0,${NO_PROXY}"
fi
RANCHER_IMAGE="rancher/rancher:$APP_VERSION"

function usage() {
    echo " Usage: $0 [-h|--help] [--print-docker-images]"
}

if ! [ -d "$RANCHER_STORE" ]; then
    mkdir -p "$RANCHER_STORE"
fi

if ! ls -1qA "$RANCHER_STORE" | grep -q .; then
    docker run --rm -it \
        -e CATTLE_SYSTEM_CATALOG=bundled \
        -v "${RANCHER_STORE}":/var-lib-rancher \
        -v "${RANCHER_CERTIFICATE}":/etc/rancher/ssl/cert.pem \
        -v "${RANCHER_CERTIFICATE_KEY}":/etc/rancher/ssl/key.pem \
        -v "${RACHER_CERTIFICATE_CA}":/etc/rancher/ssl/cacerts.pem \
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
        -v $RANCHER_CERTIFICATE:/etc/rancher/ssl/cert.pem \
        -v $RANCHER_CERTIFICATE_KEY:/etc/rancher/ssl/key.pem \
        -v $RACHER_CERTIFICATE_CA:/etc/rancher/ssl/cacerts.pem \
        --privileged \
        "${RANCHER_IMAGE}"

    docker run --rm \
        --entrypoint /bin/sh \
        "${RANCHER_IMAGE}" \
        -c 'curl -sSf https://github.com/rancher/kontainer-driver-metadata.git >/dev/null 2>&1 || (echo "Waiting (maximum) 10 minutes for Rancher to get ready..."; sleep 600)'

    wait_count=0
    while ! curl -a -s https://dosidoweb.com:9443/ping && ((wait_count < 20)); do
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

RANCHER_URL="https://dosidoweb.com:9443"

echo " Rancher UI is available on port 9443"
echo $RANCHER_URL
