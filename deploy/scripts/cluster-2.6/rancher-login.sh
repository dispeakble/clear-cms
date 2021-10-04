
DEFAULT_CLUSTER_PASSWORD="1qaz"
RANCHER_SERVER_URL="https://clearcms-cluster.local:9443"

getBoostrapPass() {
  RANCHER_STRING=$(docker logs $(docker ps --format "{{.ID}}")  2>&1 | grep "Bootstrap Password:")
  DEFAULT_PASS=${RANCHER_STRING##* }
  #DEFAULT_PASS=$(kubectl get secret --namespace cattle-system bootstrap-secret -o go-template='{{.data.bootstrapPassword|base64decode}}')
  echo $DEFAULT_PASS
}

getRancherToken() {
  TEMP_TOKEN=$(curl --proxy-insecure -k -s $RANCHER_SERVER_URL'/v3-public/localProviders/local?action=login' -H 'content-type: application/json' --data-binary '{"username":"admin","password":"'$RANCHER_PASS'","ttl":60000}' | jq -r .token)
  #TOKEN=${TEMP_TOKEN##*:}
  echo $TEMP_TOKEN
}

rancherForceLogin() {
    echo "Force Rancher Login"
    RANCHER_PASS=$(getBoostrapPass)
    while [ ! -n "$RANCHER_PASS" ]; do
      echo "password not here yet..."
      RANCHER_PASS=$(getBoostrapPass)
      echo $RANCHER_PASS
      sleep 1
    done
    RANCHER_DATA='{"username":"admin","password":"'$RANCHER_PASS'","ttl":60000}'
    echo $RANCHER_DATA

    LOGINTOKEN=$(getRancherToken)
    while [ ! -n "$LOGINTOKEN" ]; do
        echo "token not here yet..."
        echo $LOGINTOKEN
        sleep 1
    done

    echo "Login Token: $LOGINTOKEN"
#    if [ "$LOGINTOKEN" = null ]; then
#        echo "Token is null. trying to set it"
#        LOGINTOKEN=$(curl --proxy-insecure -k -s $RANCHER_SERVER_URL'/v3-public/localProviders/local?action=login' -H 'content-type: application/json' --data-binary '{"username":"admin","password":"'$RANCHER_PASS'","ttl":60000}' | jq -r .token)
#        curl --proxy-insecure -k -s $RANCHER_SERVER_URL'/v3/users?action=changepassword' -H 'Content-Type: application/json' -H "Authorization: Bearer '$LOGINTOKEN'" --data-binary '{"currentPassword":"admin","newPassword":"'$DEFAULT_CLUSTER_PASSWORD'"}'
#    else
#        curl --proxy-insecure -k -s $RANCHER_SERVER_URL'/v3/users?action=changepassword' -H 'Content-Type: application/json' -H "Authorization: Bearer '$LOGINTOKEN'" --data-binary '{"currentPassword":"'$RANCHER_PASS'","newPassword":"'$DEFAULT_CLUSTER_PASSWORD'"}'
#    fi
#    if [ "$LOGINTOKEN" = null ]; then
#      echo "cannot login with token. token not found"
#      return 1
#    fi

    echo curl --proxy-insecure -k -s $RANCHER_SERVER_URL'/v3/users?action=changepassword' -H 'Content-Type: application/json' -H "Authorization: Bearer $LOGINTOKEN" --data-binary '{"currentPassword":"'$RANCHER_PASS'","newPassword":"'$DEFAULT_CLUSTER_PASSWORD'"}'
    echo $(curl --proxy-insecure -k -s $RANCHER_SERVER_URL'/v3/users?action=changepassword' -H 'Content-Type: application/json' -H "Authorization: Bearer $LOGINTOKEN" --data-binary '{"currentPassword":"'$RANCHER_PASS'","newPassword":"'$DEFAULT_CLUSTER_PASSWORD'"}')

    RANCHER_API_TOKEN=$(curl --proxy-insecure -k -s $RANCHER_SERVER_URL'/v3/token' -H 'Content-Type: application/json' -H "Authorization: Bearer $LOGINTOKEN" --data-binary '{"type":"token","description":"for installations"}' | jq -r .token)
    echo "API Token: $RANCHER_API_TOKEN"
    echo "SERVER_URL=$RANCHER_SERVER_URL"
    SERVER_URL_JSN="{\"name\":\"server-url\",\"value\":\"$RANCHER_SERVER_URL\"}"
    echo $SERVER_URL_JSN
    curl --proxy-insecure -k $RANCHER_SERVER_URL'/v3/settings/server-url' -H 'Content-Type: application/json' -H "Authorization: Bearer $RANCHER_API_TOKEN" -X PUT --data-binary "$SERVER_URL_JSN"

    rancherLogin

}

rancherLogin() {
  echo "rancher login..."
  rancher context switch
  echo "rancher login --skip-verify --token $RANCHER_API_TOKEN $RANCHER_SERVER_URL"
    "yes" | rancher login --skip-verify --token $RANCHER_API_TOKEN $RANCHER_SERVER_URL

  return 1
}