#!/bin/bash -e
############################################
#####   Ericom Shield Deploy Shield    #####
#######################################BH###

SHIELD_MNG="yes"
SHIELD_PROXY="yes"
SHIELD_FARM="yes"
SHIELD_ELK="yes"
SET_LABELS="No"
ES_FORCE="false"
ES_OVERWRITE="false"
ES_UPDATE="false"
ES_CUSTOM_PATH="false"
NOT_FOUND_STR="404: Not Found"
ES_PATH="$HOME/ericomshield"
ES_VERSION_FILE="$ES_PATH/.esversion"
LOGFILE="$ES_PATH/ericomshield.log"
LAST_DEPLOY_LOGFILE="$ES_PATH/last_deploy.log"
SHIELD_NS_COUNT=5
SHIELD_REPO="."
PARTNER=""
DEBUG="" #"--debug"

# shield-role/management=accept
# shield-role/proxy=accept
# shield-role/elk=accept
# shield-role/farm-services=accept
# shield-role/remote-browsers=accept

function usage() {
    if ! [[ $0 != "$BASH_SOURCE" ]]; then
      CMD=$(ps -o comm= $PPID)
     else
      CMD=$0 
    fi

    #undocumented arguments [-o|--overwrite] [-L|--local] [-u|--update]
    echo " Usage: $CMD [-n|--namespace <NAMESPACE> (<NAMESPACE>)] [-l|--label][-f|--force] [-h|--help]"
    echo
    echo "    namespaces: shield-management, shield-proxy, shield-farm, shield-elk"
}

function log_message() {
    local PREV_RET_CODE=$?
    echo "$@"
    echo "$(LC_ALL=C date): $@" >>"$LOGFILE"
    if ((PREV_RET_CODE != 0)); then
        return 1
    fi
    return 0
}
log_message "********    $0 $@"

# Create the Ericom empty dir if necessary
if [ ! -d $ES_PATH ]; then
    mkdir -p $ES_PATH
    chmod 0755 $ES_PATH
fi

function download_and_check() {
    curl -s -S -o "$1" "$2"
    if [ ! -f "$1" ] || [ $(grep -c "$NOT_FOUND_STR" "$1") -ge 1 ]; then
        echo "Error: cannot download "$1", exiting"
        exit 1
    fi
}

get_timezone() {
    local TZ
    if [ -h /etc/localtime ]; then
        TZ=":$(readlink /etc/localtime | sed 's|.*/usr/share/zoneinfo/||')"
    elif [ -f /etc/timezone ]; then
        TZ="$(cat /etc/timezone)"
    elif [ -f /etc/localtime ]; then
        TZ=":$(find /usr/share/zoneinfo/ -type f -exec md5sum {} \; | grep "^$(md5sum /etc/localtime | cut -d' ' -f1)" | sed 's|.*/usr/share/zoneinfo/||' | head -n 1)" #"
    else
        TZ="$(date +%Z)"
    fi

    echo $TZ
}
FIRST_NAMESPACE="true"
only_namespace() {
    if [ $FIRST_NAMESPACE == "true" ]; then
        SHIELD_MNG="no"
        SHIELD_PROXY="no"
        SHIELD_FARM="no"
        SHIELD_ELK="no"
        FIRST_NAMESPACE="false"
        SHIELD_NS_COUNT=1
    fi
    SHIELD_NS_COUNT=$((SHIELD_NS_COUNT + 1))
    case "$1" in
    shield-management)
        SHIELD_MNG="yes"
        ;;
    shield-proxy)
        SHIELD_PROXY="yes"
        ;;
    shield-farm)
        SHIELD_FARM="yes"
        ;;
    shield-elk)
        SHIELD_ELK="yes"
        ;;
    *)
        usage
        exit
        ;;
    esac
}

while [ $# -ne 0 ]; do
    arg="$1"
    case "$arg" in
    -n | --namespace)
       if [ -z "$2" ]; then
         echo "missing namespace"
         usage
         exit
        else
         while [ ! -z "$2" ] && [[ "$2" == *"shield-"* ]] ; do
            only_namespace "$2"
            shift
         done
        fi
        ;;
    -l | --label)
        SET_LABELS="yes"
        ;;
    -o | --overwrite)
        ES_OVERWRITE="true"
        ;;
    -L | --local)
        if [ -z "$2" ]; then
          SHIELD_REPO=".."
         else
          SHIELD_REPO="$2"
          shift
        fi
        echo "Custom Path: $SHIELD_REPO"
        ES_CUSTOM_PATH="true"
        ;;
    -f | --force)
        ES_FORCE="true"
        ;;
    -u | --update)
        ES_UPDATE="true"
        ;;
    -P | --partner)
        PARTNER="$2"
        ;;  
    -h | --help)
#    *)
        usage
        exit
        ;;
    esac
    shift
done

##################      MAIN: EVERYTHING STARTS HERE: ##########################

log_message "***************     Ericom Shield Kube Setup ..."

SYSTEMID=$(kubectl get namespace kube-system -o=jsonpath='{.metadata.uid}')
echo $SYSTEMID

# If Update need to rename shield folder (on OVA)
if [ "$ES_UPDATE" = "true" ] && [ -d "$ES_PATH/shield-repo" ] ; then
  log_message "Updating Shield (renaming original shield-repo folder) "
  mv "$ES_PATH/shield-repo" "$ES_PATH/shield-repo-org"
fi

if [ "$ES_CUSTOM_PATH" = "false" ];then
   cd "$ES_PATH" || exit 1
fi

if [ -f "$ES_VERSION_FILE" ]; then
    VERSION=$(cat "$ES_VERSION_FILE")
    echo "New Version:" "$VERSION"
fi

VERSION_DEPLOYED=$(helm ls --all-namespaces | grep -m 1 shield | awk '{ print $10 }')
if [ ! -z "$VERSION_DEPLOYED" ] && [ $(helm ls --all-namespaces | grep -c "$VERSION_DEPLOYED") = "$SHIELD_NS_COUNT" ]; then
    VERSION_DEPLOYED=$(helm ls --all-namespaces | grep -m 1 shield | awk '{ print $10 }')
    log_message "Current Version Deployed: $VERSION_DEPLOYED"
else
    echo "$VERSION_DEPLOYED"
    log_message "Shield is not fully deployed"
    VERSION_DEPLOYED=""
fi

if [ "$VERSION" = "Rel-$VERSION_DEPLOYED" ]; then
    echo "Your EricomShield System is Up to date ($VERSION_REPO)"
    if [ "$ES_FORCE" = "false" ]; then
        exit
    fi
fi

TZ="$(get_timezone)"

UPSTREAM_DNS_SERVERS="$(grep -oP 'nameserver\s+\K.+' /etc/resolv.conf | cut -d, -f2- | paste -sd,)"
if [ "$UPSTREAM_DNS_SERVERS" = "127.0.0.53" ]; then
    UPSTREAM_DNS_SERVERS="$(systemd-resolve --status | grep -oP 'DNS Servers:\s+\K.+' | paste -sd,)"
fi

log_message "***************     Deploying Ericom Shield Repo:$VERSION_REPO on System:$SYSTEMID ..."
echo "***************     Deploying Ericom Shield from Repo:$VERSION_REPO ..." > "$LAST_DEPLOY_LOGFILE"

log_message "***************     Deploying Shield Common *******************************"
if [ $(kubectl get namespace | grep common | grep -c Active) -le 0 ]; then
   kubectl create namespace common
fi
helm upgrade --install shield-common $SHIELD_REPO/shield --namespace=common -f custom-common.yaml $DEBUG | tee -a "$LAST_DEPLOY_LOGFILE"

if [ "$SHIELD_FARM" = "yes" ]; then
    log_message "***************     Deploying Shield Farm Services *******************************"
    if [ "$SET_LABELS" = "yes" ]; then
        log_message "Setting Labels: farm-services, remote-browsers"
        kubectl label node --all shield-role/farm-services=accept --overwrite
        kubectl label node --all shield-role/remote-browsers=accept --overwrite
    fi
    if [ $(kubectl get namespace | grep farm-services | grep -c Active) -le 0 ]; then
        kubectl create namespace farm-services
    fi
    helm upgrade --install shield-farm-services $SHIELD_REPO/shield --namespace=farm-services \
        --set-string "farm-services.TZ=${TZ}" --set-string "farm-services.CLUSTER_SYSTEM_ID=$SYSTEMID" \
        -f custom-farm.yaml $DEBUG | tee -a "$LAST_DEPLOY_LOGFILE"
    sleep 30
fi

if [ "$SHIELD_MNG" = "yes" ]; then
    log_message "***************     Deploying Shield Management *******************************"
    if [ "$SET_LABELS" = "yes" ]; then
        log_message "Setting Labels: management"
        kubectl label node --all shield-role/management=accept --overwrite
    fi
    if [ $(kubectl get namespace | grep management | grep -c Active) -le 0 ]; then
        kubectl create namespace management
    fi
    if [ -z "$PARTNER" ]; then
       helm upgrade --install shield-management $SHIELD_REPO/shield --namespace=management \
          --set-string "shield-mng.TZ=${TZ}" --set-string "shield-mng.CLUSTER_SYSTEM_ID=$SYSTEMID" \
          -f custom-management.yaml $DEBUG | tee -a "$LAST_DEPLOY_LOGFILE"
     else
       helm upgrade --install shield-management $SHIELD_REPO/shield --namespace=management \
          --set-string "shield-mng.TZ=${TZ}" --set-string "shield-mng.CLUSTER_SYSTEM_ID=$SYSTEMID" \
          --set-string "shield-mng.EULA_PROVIDER=${PARTNER}" \
          -f custom-management.yaml $DEBUG | tee -a "$LAST_DEPLOY_LOGFILE"
    fi
    sleep 30
fi

if [ "$SHIELD_PROXY" = "yes" ]; then
    log_message "***************     Deploying Shield Proxy *******************************"
    if [ "$SET_LABELS" = "yes" ]; then
        log_message "Setting Labels: proxy"
        kubectl label node --all shield-role/proxy=accept --overwrite
    fi
    if [ $(kubectl get namespace | grep proxy | grep -c Active) -le 0 ]; then
        kubectl create namespace proxy
    fi    
    helm upgrade --install shield-proxy $SHIELD_REPO/shield --namespace=proxy \
        --set-string "shield-proxy.TZ=${TZ}" --set-string "shield-proxy.CLUSTER_SYSTEM_ID=$SYSTEMID" \
        --set-string "shield-proxy.UPSTREAM_DNS_SERVERS=$(echo ${UPSTREAM_DNS_SERVERS} | sed 's#,#\\,#g')" \
        -f custom-proxy.yaml $DEBUG | tee -a "$LAST_DEPLOY_LOGFILE"

    sleep 30
fi

if [ "$SHIELD_ELK" = "yes" ]; then
    log_message "***************     Deploying Shield ELK *******************************"
    if [ "$SET_LABELS" = "yes" ]; then
        log_message "Setting Labels: elk"
        kubectl label node --all shield-role/elk=accept --overwrite
    fi
    if [ $(kubectl get namespace | grep elk | grep -c Active) -le 0 ]; then
        kubectl create namespace elk
    fi    
    helm upgrade --install shield-elk $SHIELD_REPO/shield --namespace=elk \
        --set-string "elk.TZ=${TZ}" --set-string "elk.CLUSTER_SYSTEM_ID=$SYSTEMID" \
        -f custom-values-elk.yaml $DEBUG | tee -a "$LAST_DEPLOY_LOGFILE"
fi

log_message "***************     Done!"

helm ls --all-namespaces

exit 0
