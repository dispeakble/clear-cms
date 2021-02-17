#!/bin/sh
docker rm -f $(docker ps -qa)
docker volume rm $(docker volume ls -q)
cleanupdirs="/var/lib/etcd /etc/kubernetes /etc/cni /opt/cni /var/lib/cni /var/run/calico /opt/rke /home/dosidoweb/rancher/rancher-store /var/lib/rancher"
for dir in $cleanupdirs; do
  echo "Removing $dir"
  rm -rf $dir
done
