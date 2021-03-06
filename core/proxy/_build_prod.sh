#!/bin/sh -ex
# tip: do..
# DEV_IMAGE_TAG=$(date +%s) ./_build.sh
#...to tag image with linux timestamp
DEV_IMAGE_TAG=$(date +%s) # default DEV_IMAGE_TAG
IMAGE_NAME_TAG="dispeakble/crm-proxy:${DEV_IMAGE_TAG}"

docker build -t "${IMAGE_NAME_TAG}" .
docker push IMAGE_NAME_TAG
