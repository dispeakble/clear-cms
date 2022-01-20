#!/bin/sh
docker rm -f $(docker ps -qa)
docker volume rm $(docker volume ls -q)
paths="/var/lib/etcd /etc/kubernetes /etc/cni /opt/cni /var/lib/cni /var/run/calico /opt/rke /home/dosidoweb/rancher/data /home/dosidoweb/rancher/rancher-store /var/lib/rancher /home/dosidoweb/cms_app /usr/bin/rancher /var/lib/longhorn /home/dosidoweb/rancher /home/dosidoweb/sources /home/dosidoweb/.rancher"
for path in $paths; do
  echo "deleting $path"
  rm -rf $path
done
echo "app cleaned"
