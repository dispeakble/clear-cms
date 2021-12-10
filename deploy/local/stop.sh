#!/bin/bash



VERSION="v0.0.1"
docker-compose -f versions/$VERSION/base.yaml down -v

#docker rm -f $(docker ps -qa)
#docker volume rm $(docker volume ls -q)

#************************************* start cms app *************************************#

#docker-compose -f "./versions/$VERSION/hub.yaml" down -d
#docker-compose -f "./versions/$VERSION/admin-proxy.yaml" down -d
#docker-compose -f "./versions/$VERSION/client-proxy.yaml" down -d
#docker-compose -f "./versions/$VERSION/system-api.yaml" down -d
#docker-compose -f "./versions/$VERSION/frontend-api.yaml" down -d
#docker-compose -f "./versions/$VERSION/db.yaml" down -d
#docker-compose -f "./versions/$VERSION/bucket.yaml" down -d


#************************************* end cms app *************************************#