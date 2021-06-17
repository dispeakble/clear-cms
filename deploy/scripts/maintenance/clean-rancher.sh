#!/bin/sh
docker rm -f $(docker ps -qa)
docker volume rm $(docker volume ls -q)
paths="/var/lib/etcd /etc/kubernetes /etc/cni /opt/cni /var/lib/cni /var/run/calico /opt/rke $HOME/rancher/rancher-store /var/lib/rancher $HOME/cms_app /usr/bin/rancher"
for path in $paths; do
  echo "deleting $path"
  rm -rf $path
done
echo "app cleaned"
