curl https://baltocdn.com/helm/signing.asc | sudo apt-key add -
sudo apt-get install apt-transport-https --yes
echo "deb https://baltocdn.com/helm/stable/debian/ all main" | sudo tee /etc/apt/sources.list.d/helm-stable-debian.list
sudo apt-get update
sudo apt-get install helm --yes

sudo docker stop $(docker ps -aq)
sudo docker rm $(docker ps -aq)
sudo docker volume prune -f

sudo rm -fr /opt/rancher