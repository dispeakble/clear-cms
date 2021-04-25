CMS_NAME="cms-cluster"
CMS_PATH="$HOME/cms_app"
RANCHER_URL_FILE="$CMS_PATH/rancher_url.txt"
RANCHER_TOKEN_FILE="$CMS_PATH/rancher_token.txt"
RANCHER_API_TOKEN="NDY"
RANCHER_SERVER_URL="NDY"
RANCHER_URL="https://localhost:9443"
DEFAULT_CLUSTER_PASSWORD="1qaz"

getRancherToken() {
  echo $(curl -k -s ${RANCHER_URL}'/v3-public/localProviders/local?action=login' -H 'content-type: application/json' --data-binary '{"username":"admin","password":"'${DEFAULT_CLUSTER_PASSWORD}'","ttl":60000}' | jq -r .token)
}

rancherForceLogin() {
    LOGINTOKEN=$(curl -k -s 'https://127.0.0.1:9443/v3-public/localProviders/local?action=login' -H 'content-type: application/json' --data-binary '{"username":"admin","password":"1qaz","ttl":60000}' | jq -r .token)
    if [ "$LOGINTOKEN" = null ]; then
        echo "Token is null. trying to set it"
        LOGINTOKEN=$(curl -k -s 'https://127.0.0.1:9443/v3-public/localProviders/local?action=login' -H 'content-type: application/json' --data-binary '{"username":"admin","password":"1qaz","ttl":60000}' | jq -r .token)
    else
        curl -k -s 'https://127.0.0.1:9443/v3/users?action=changepassword' -H 'Content-Type: application/json' -H "Authorization: Bearer $LOGINTOKEN" --data-binary '{"currentPassword":"1qaz","newPassword":"1qaz"}'
    fi
    if [ "$LOGINTOKEN" = null ]; then
      echo "cannot login with token. token not found"
      return 1
    fi
    RANCHER_API_TOKEN=$(curl -k -s 'https://127.0.0.1:9443/v3/token' -H 'Content-Type: application/json' -H "Authorization: Bearer $LOGINTOKEN" --data-binary '{"type":"token","description":"for installations"}' | jq -r .token)
    echo "API Token: ${RANCHER_API_TOKEN}"
    touch $RANCHER_TOKEN_FILE
    echo $RANCHER_API_TOKEN >$RANCHER_TOKEN_FILE
    echo "SERVER_URL=$RANCHER_SERVER_URL"
    SERVER_URL_JSN="{\"name\":\"server-url\",\"value\":\"${RANCHER_SERVER_URL}\"}"
    echo $SERVER_URL_JSN
    curl -k 'https://127.0.0.1:9443/v3/settings/server-url' -H 'Content-Type: application/json' -H "Authorization: Bearer $RANCHER_API_TOKEN" -X PUT --data-binary "$SERVER_URL_JSN"

    rancherLogin

}

rancherLogin() {
  echo "rancher login..."
  rancher context switch
  echo "rancher login --skip-verify --token $RANCHER_API_TOKEN $RANCHER_URL"
    "yes" | rancher login --skip-verify --token $RANCHER_API_TOKEN $RANCHER_URL
}