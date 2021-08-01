#!/bin/sh -ex
IMAGE_NAME_TAG="dispeakble/crm-frontend:latest"

docker build -t "${IMAGE_NAME_TAG}" .
docker push IMAGE_NAME_TAG
