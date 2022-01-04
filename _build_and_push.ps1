$env:CRM_IMG_TAG=[int][double]::Parse((Get-Date -UFormat %s))

docker-compose -f docker-compose-modules-push.yml build
docker-compose -f docker-compose-modules-push.yml push

echo $CRM_IMG_TAG