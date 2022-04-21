#!/bin/sh -ex
export CRM_IMG_TAG=$(date +%s)
docker-compose -f docker-compose-modules-push.yml build
docker-compose -f docker-compose-modules-push.yml push
echo $CRM_IMG_TAG