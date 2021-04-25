#!/bin/bash
RANCHER_PATH="$HOME/rancher-dist/"
LOGFILE="$RANCHER_PATH/main.log"

APP_file_rancher="run-rancher.sh"
APP_file_rancher_cli="infrastructure/install-rancher-cli.sh"
APP_file_kubectl="infrastructure/install-kubectl.sh"
APP_file_helm="infrastructure/install-helm.sh"
APP_file_create_cluster="create-cluster.sh"
APP_file_deploy="deploy-app.sh"

echo "$0 $@"

if ((EUID != 0)); then
    usage
    echo "try sudo $0 $@"
    exit
fi

if [ ! -d $APP_PATH ]; then
    mkdir -p $APP_PATH
    chmod 0755 $APP_PATH
fi

cd "$APP_PATH" || exit 1

args="$@"

if [ ! -x "/usr/bin/docker" ]; then
   echo "Docker is not installed"
   exit 1
fi

if [ ! -f ~/.kube/config ] || [ $(cat ~/.kube/config | wc -l) -le 1 ]; then
    echo
    echo "Installing Kubectl"
    source "./$APP_file_kubectl"
    if [ $? != 0 ]; then
       echo "$APP_file_kubectl Failed, Exiting!"
       exit 1
    fi

    echo
    echo "Running Rancher Server"
    source "./$APP_file_rancher"
    if [ $? != 0 ]; then
        echo "$APP_file_run_rancher Failed"
        exit 1
    fi

    echo "Installing Rancher CLI"
    source "./$APP_file_rancher_cli"
    if [ $? != 0 ]; then
       echo "$APP_file_run_rancher_cli Failed"
       exit 1
    fi  
    echo "Creating Cluster"
    source "./$APP_file_create_cluster" $args
    if [ $? != 0 ]; then
       echo "$APP_file_create_cluster Failed"
       exit 1
    fi
fi

if [ ! -f ~/.kube/config ] || [ $(cat ~/.kube/config | wc -l) -le 1 ]; then
    echo
    echo "ERROR: You need to create a cluster and set ~/.kube/config from the rancher UI after the cluster is created"
    exit 0
fi

rancher_version=$(bash "./$APP_file_rancher" --print-app-version)
echo "Rancher Version: $rancher_version"
rancher_running=$(docker ps | grep -c rancher/rancher:)
echo "Rancher Running: $rancher_running"

function checkRancherState() {
    echo "Checking rancher state"
    RANCHER_STATE=0
    wait_count=0
    while [ -z "$RANCHER_STATE" ] && ((wait_count < 90)); do
        echo -n .
        sleep 10
        wait_count=$((wait_count + 1))
        RANCHER_STATE=$(docker ps | grep rancher/rancher)
    done
    if [ "$RANCHER_STATE" -lt 1 ]; then
        echo "Cluster cannot be created"
        exit 1
    fi
    return 0
}

if [ $rancher_running -ge 1 ]; then
   rancher_running_version=$(docker ps | grep -c rancher/rancher:$rancher_version)
   echo "Rancher $rancher_version Running: $rancher_running_version"
   if [ $rancher_running_version -lt 1 ]; then
      echo "stopping old rancher"
      docker stop $(docker ps | grep rancher/rancher: | awk '{ print $1 }')
      sleep 5
      rancher_running=$(docker ps | grep -c rancher/rancher:)
      if [ $rancher_running_version -lt 1 ]; then
         echo "stopping old rancher"
         docker rm -f $(docker ps | grep rancher/rancher: | awk '{ print $1 }')  
      fi
      #run "New" Version of Rancher Server
      echo "launching rancher"
      source "./$APP_file_rancher"
      if [ $? != 0 ]; then
          echo "ERROR: $APP_file_run_rancher Failed, Exiting!"
          exit 1
      fi



      sleep 30
   fi
fi

#5. install-helm.sh
echo 
INSTALL_HELM="true"

if  which helm >/dev/null ; then
    HELM_VERSION=$(bash "./$APP_file_helm" --print-app-version)
    if [ $(helm version | grep -c $HELM_VERSION) -ge 1 ]; then
       echo "Helm Version $HELM_VERSION already installed"
       INSTALL_HELM="false"
    fi   
fi

if [ $INSTALL_HELM = "true" ];then
   echo " [-] Installing Helm"
   bash "./$APP_file_helm" -i
   if [ $? != 0 ]; then
      echo " [-] $APP_file_helm failed"
      exit 1
   fi
fi

echo " [-] starting app"
./$APP_file_deploy $args
if [ $? != 0 ]; then
  echo " [-] $APP_file_deploy failed"
  exit 1
fi
echo " installed"
