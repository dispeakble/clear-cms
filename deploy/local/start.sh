#!/bin/bash

DOCKERHUB_USERNAME="cmsbot"
DOCKERHUB_PASS="uB8V7B6IR5ll"
#BITBUCKET_USERNAME="the_dispeakble_one"
#BITBUCKET_PASS='WrBr1Xh611f9'

INIT_VERSION="v0.0.1"

#TODO MOVE TO AN ENV FILE
INIT_POSTGRES_DEFAULT_USER=cms
INIT_POSTGRES_DEFAULT_PASSWORD=1qaz
INIT_POSTGRES_DEFAULT_DB=cms
INIT_PGADMIN_DEFAULT_EMAIL=admin@localhost.local
INIT_PGADMIN_DEFAULT_PASSWORD=1qaz
INIT_REDIS_DEFAULT_PASSWORD=1gzHwbgfwR

USER_VERSION=$(promptText "Installation revision (Enter for default: $INIT_VERSION)")
USER_REDIS_DEFAULT_PASSWORD=$(promptSecret "Redis password (Enter for default: $INIT_REDIS_DEFAULT_PASSWORD)")
echo -e "\n*** Secret stored ***\n"
USER_POSTGRES_DEFAULT_USER=$(promptText "Postgres user (Enter for default: $INIT_POSTGRES_DEFAULT_USER)")
USER_POSTGRES_DEFAULT_PASSWORD=$(promptSecret "Postgres password (Enter for default: $INIT_POSTGRES_DEFAULT_PASSWORD)")
echo -e "\n*** Secret stored ***\n"
USER_POSTGRES_DEFAULT_DB=$(promptText "Postgres Database name (Enter for default: $INIT_POSTGRES_DEFAULT_DB)")
USER_PGADMIN_DEFAULT_EMAIL=$(promptText "PgAdmin email (Enter for default: $INIT_PGADMIN_DEFAULT_EMAIL)")
USER_PGADMIN_DEFAULT_PASSWORD=$(promptSecret "PgAdmin password (Enter for default: $INIT_PGADMIN_DEFAULT_PASSWORD)")
echo -e "\n*** Secret stored ***\n"

export DEFAULT_VERSION=$([[ -z $USER_VERSION ]] && echo $INIT_VERSION || echo $USER_VERSION)
export REDIS_DEFAULT_PASSWORD=$([[ -z $USER_REDIS_DEFAULT_PASSWORD ]] && echo $INIT_REDIS_DEFAULT_PASSWORD || echo $USER_REDIS_DEFAULT_PASSWORD)
export POSTGRES_DEFAULT_USER=$([[ -z $USER_POSTGRES_DEFAULT_USER ]] && echo $INIT_POSTGRES_DEFAULT_USER || echo $USER_POSTGRES_DEFAULT_USER)
export POSTGRES_DEFAULT_PASSWORD=$([[ -z $USER_POSTGRES_DEFAULT_PASSWORD ]] && echo $INIT_POSTGRES_DEFAULT_PASSWORD || echo $USER_POSTGRES_DEFAULT_PASSWORD)
export POSTGRES_DEFAULT_DB=$([[ -z $USER_USER_POSTGRES_DEFAULT_DB ]] && echo $INIT_USER_POSTGRES_DEFAULT_DB || echo $USER_USER_POSTGRES_DEFAULT_DB)
export PGADMIN_DEFAULT_EMAIL=$([[ -z $USER_PGADMIN_DEFAULT_EMAIL ]] && echo $INIT_PGADMIN_DEFAULT_EMAIL || echo $USER_PGADMIN_DEFAULT_EMAIL)
export PGADMIN_DEFAULT_PASSWORD=$([[ -z $USER_PGADMIN_DEFAULT_PASSWORD ]] && echo $INIT_PGADMIN_DEFAULT_PASSWORD || echo $USER_PGADMIN_DEFAULT_PASSWORD)
export CMS_HUB_VERSION=1639086625
export CMS_DB_VERSION=1639086625
export CMS_BUCKET_VERSION=1639086625

echo "**************** Starting Services *****************"

echo -e "\n"

echo "./versions/$DEFAULT_VERSION/base.yaml"

docker-compose -f "./versions/$DEFAULT_VERSION/base.yaml" up -d

echo -e "\n"

echo "**************** Services Started *****************"
