sudo docker stop $(docker ps -aq)
sudo docker rm $(docker ps -aq)
sudo docker volume prune -f

sudo rm -fr /opt/rancher
sudo rm -fr /var/lib/kubelet
sudo rm -fr /var/lib/rancher


sudo docker run -d --restart=always -p 8080:80 -p 8443:443 rancher/rancher:latest #-v /opt/rancher:/var/lib/rancher