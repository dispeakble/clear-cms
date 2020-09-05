sudo apt install -y curl
sudo curl https://releases.rancher.com/install-docker/19.03.sh | sh
sudo docker run -d --restart=unless-stopped \
  -p 8080:80 -p 8443:443 \
  rancher/rancher:latest
