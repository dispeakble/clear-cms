#!/bin/sh -ex
export CRM_IMG_TAG=$(date +%s)
export CRM_DOCKER_USERNAME="ovidiualexa"
docker-compose -f docker-compose-modules-push.yml build
