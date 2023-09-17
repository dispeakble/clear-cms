#!/usr/bin/env powershell
$env:CRM_IMG_TAG=[int][double]::Parse((Get-Date -UFormat %s))
$env:CRM_DOCKER_USERNAME="ovidiualexa"

docker-compose -f docker-compose-modules-push.yml build

echo $env:CRM_IMG_TAG