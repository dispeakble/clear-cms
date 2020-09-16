#!/bin/bash
STEP_BY_STEP="false"
ES_PATH="$HOME/ericomshield"
LOGFILE="$ES_PATH/ericomshield.log"
DEPLOY_SHIELD="true"

function usage() {
    echo " Usage: $0 [-l|--label] [-f|--force] [-h|--help]"
}

ES_file_sysctl="configure-sysctl-values.sh"
ES_file_rancher="run-rancher.sh"
ES_file_rancher_cli="install-rancher-cli.sh"
ES_file_create_cluster="create-cluster.sh"
ES_file_kubectl="install-kubectl.sh"
ES_file_helm="install-helm.sh"
ES_file_deploy_shield="deploy-app.sh"

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

function step() {
    if [ $STEP_BY_STEP = "true" ]; then
        read -p 'Press Enter to continue...' ENTER
    fi
}

#Check if we are root
if ((EUID != 0)); then
    # sudo su
    usage
    echo " Please run it as Root"
    echo "sudo $0 $@"
    exit
fi

# Create the Ericom empty dir if necessary
if [ ! -d $ES_PATH ]; then
    mkdir -p $ES_PATH
    chmod 0755 $ES_PATH
fi

cd "$ES_PATH" || exit 1

args="$@"

while [ $# -ne 0 ]; do
    arg="$1"
    case "$arg" in
    -h | --help)
        #    *)
        usage
        exit
        ;;
    esac
    shift
done

# download TO (local-file) FROM (remote-url)
# [+x] chmod executable
function download_and_check() {
    curl -sL -S -o "$1" "$2"
    if [ ! -f "$1" ] || [ $(grep -c -x "$NOT_FOUND_STR" "$1") -ge 1 ]; then
        log_message "Error: cannot download "$2", exiting"
        exit 1
    fi
    if [ "$3a" = "+xa" ]; then
        chmod +x "$1"
    fi
}

##################      MAIN: EVERYTHING STARTS HERE: ##########################

if [ ! -x "/usr/bin/docker" ]; then
   log_message "FATAL: Docker is not installed exiting..."
   exit 1
fi

if [ ! -f ~/.kube/config ] || [ $(cat ~/.kube/config | wc -l) -le 1 ]; then
    
    #1.  Run configure-sysctl-values.sh
    echo
    log_message "***************     Configure sysctl values"
    source "./$ES_file_sysctl"
    if [ $? != 0 ]; then
        log_message "*************** $ES_file_sysctl Failed, Exiting!"
        exit 1
    fi

    step
    #2.  install-kubectl.sh
    #TODO: map kubectl bin from shield-cli to host
    echo
    log_message "***************     Installing Kubectl"
    source "./$ES_file_kubectl"
    if [ $? != 0 ]; then
       log_message "*************** $ES_file_kubectl Failed, Exiting!"
       exit 1
    fi
    step

    #4.  run-rancher.sh
    echo
    log_message "***************     Running Rancher Server"
    source "./$ES_file_rancher"
    if [ $? != 0 ]; then
        log_message "*************** $ES_file_run_rancher Failed, Exiting!"
        exit 1
    fi

    #5.  install-rancher-cli
    log_message "***************     Installing Rancher CLI"
    source "./$ES_file_rancher_cli"
    if [ $? != 0 ]; then
       log_message "*************** $ES_file_run_rancher_cli Failed, Exiting!"
       exit 1
    fi  
    #6.  create-cluster.sh
    log_message "***************     Creating SHIELD Cluster"
    source "./$ES_file_create_cluster" $args
    if [ $? != 0 ]; then
       log_message "*************** $ES_file_create_cluster Failed, Exiting!"
       exit 1
    fi
fi

if [ ! -f ~/.kube/config ] || [ $(cat ~/.kube/config | wc -l) -le 1 ]; then
    echo
    echo "Please Create your cluster, Set Labels, Set ~/.kube/config and come back...."
    exit 0
fi

rancher_version=$(bash "./$ES_file_rancher" --print-app-version)
echo "Rancher Version: $rancher_version"
rancher_running=$(docker ps | grep -c rancher/rancher:)
echo "Rancher Running: $rancher_running"

if [ $rancher_running -ge 1 ]; then
   rancher_running_version=$(docker ps | grep -c rancher/rancher:$rancher_version)
   echo "Rancher $rancher_version Running: $rancher_running_version"
   if [ $rancher_running_version -lt 1 ]; then
      echo "Stopping Old Version of Rancher Server"
      docker stop $(docker ps | grep rancher/rancher: | awk '{ print $1 }')
      sleep 5
      rancher_running=$(docker ps | grep -c rancher/rancher:)
      if [ $rancher_running_version -lt 1 ]; then
         echo "Stopping(force) Old Version of Rancher Server"
         docker rm -f $(docker ps | grep rancher/rancher: | awk '{ print $1 }')  
      fi
      #run "New" Version of Rancher Server
      log_message "***************     Running Rancher Server"
      source "./$ES_file_rancher"
      if [ $? != 0 ]; then
          log_message "*************** $ES_file_run_rancher Failed, Exiting!"
          exit 1
      fi
      #ideally wait until Rancher is up again
      sleep 30
   fi
fi

#5. install-helm.sh
echo 
#TODO map helm bin from shield-cli to host
INSTALL_HELM="true"

if  which helm >/dev/null ; then
    HELM_VERSION=$(bash "./$ES_file_helm" --print-app-version)
    if [ $(helm version | grep -c $HELM_VERSION) -ge 1 ]; then
       echo "Helm Version $HELM_VERSION is already installed"
       INSTALL_HELM="false"
    fi   
fi

if [ $INSTALL_HELM = "true" ];then
   log_message " [-] Installing Helm"
   bash "./$ES_file_helm" -i
   if [ $? != 0 ]; then
      log_message " [-] $ES_file_helm failed"
      exit 1
   fi
fi

step
log_message " [-] starting app"
./$ES_file_deploy_shield $args
if [ $? != 0 ]; then
  log_message " [-] $ES_file_deploy_shield failed"
  exit 1
fi
log_message " successfully installed"
