#!/bin/bash

installService "infrastructure/install-packages.sh"

source "./setup.sh"

sleep 10

echo "scaling down cms-frontend-api"
kubectl scale deployment --replicas 0 -n default cms-frontend-api
echo "scaling down cms-frontend-proxy"
kubectl scale deployment --replicas 0 -n default cms-frontend-proxy
echo "scaling down cms-proxy"
kubectl scale deployment --replicas 0 -n default cms-proxy
echo "scaling down cms-system"
kubectl scale deployment --replicas 0 -n default cms-system

#echo "setting up the max_user_watches to 524288"
#echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf && sudo sysctl -p





