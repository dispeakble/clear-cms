#!/bin/sh
docker rm -f $(docker ps -qa)
docker volume rm $(docker volume ls -q)
paths="/var/lib/etcd /etc/kubernetes /etc/cni /opt/cni /var/lib/cni /var/run/calico /opt/rke /home/dosidoweb/rancher/rancher-store /var/lib/rancher /home/dosidoweb/cms_app /usr/bin/rancher /var/lib/longhorn"
#paths="/var/lib/etcd /etc/kubernetes /etc/cni /opt/rancher /opt/cni /var/lib/cni /var/run/calico /opt/rke $HOME/rancher /var/lib/rancher $HOME/cms_app /usr/bin/rancher /var/lib/longhorn /usr/local/bin/rancher-system-agent /rancher_store /home/dosidoweb/rancher"
for path in $paths; do
  echo "deleting $path"
  rm -rf $path
done
echo "app cleaned"
