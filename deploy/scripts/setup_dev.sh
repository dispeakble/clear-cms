#!/bin/bash

source "./setup.sh"
installService "infrastructure/install-packages.sh"


totalswapstring=$(grep SwapTotal /proc/meminfo)
totalswapvalue=${totalswapstring##*:}
totalswapkb=$((${totalswapvalue//" kB"/""} + 1))
echo "Swap total: $totalswapkb"

if [ 8388605 -gt "$totalswapkb" ]; then
  echo "setting up larger swap"
  sudo swapoff -a
  sudo dd if=/dev/zero of=/swapfile bs=1G count=8
  sudo chmod 600 /swapfile
  sudo mkswap /swapfile
  sudo swapon /swapfile
fi

sleep 10

echo "scaling down cms-frontend-api"
kubectl scale deployment --replicas 0 -n default cms-frontend-api
echo "scaling down cms-frontend-proxy"
kubectl scale deployment --replicas 0 -n default cms-frontend-proxy
echo "scaling down cms-proxy"
kubectl scale deployment --replicas 0 -n default cms-proxy
echo "scaling down cms-system"
kubectl scale deployment --replicas 0 -n default cms-system

if [ -z "$(cat /etc/sysctl.conf | grep fs.inotify.max_user_watches=524288)" ]; then
  echo "setting up the max_user_watches to 524288"
  echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf && sudo sysctl -p
fi







