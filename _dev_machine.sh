#!/bin/sh -ex
export CRM_IMG_TAG=$(date +%s)
docker-compose -f docker-compose-dev-machine-push.yml build