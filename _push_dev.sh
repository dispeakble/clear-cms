#!/bin/sh -ex
export CRM_IMG_TAG="latest"
docker-compose -f docker-compose-modules-push.yml push