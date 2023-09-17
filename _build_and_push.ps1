#!/usr/bin/env powershell
$env:CRM_IMG_TAG=[int][double]::Parse((Get-Date -UFormat %s))
$env:CRM_DOCKER_USERNAME=Get-Content ./deploy/local/secrets/dockeruser.txt
$env:CRM_DOCKER_REGISTRY=Get-Content ./deploy/local/secrets/dockerregistry.txt

docker-compose -f docker-compose-modules-push.yml build
docker-compose -f docker-compose-modules-push.yml push

echo $env:CRM_IMG_TAG