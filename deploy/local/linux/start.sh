#!/bin/bash

DOCKERHUB_USERNAME="dispeakble"
DOCKERHUB_PASS="zF*%d5^nTOwPt$!1"

INIT_APP_NAME="clearcms"
INIT_APP_VERSION="1.5.0"
INIT_WEBSITE_NAME="Clear CMS"
INIT_WEBSITE_EMAIL="contact@clearcms.com"
INIT_ADMIN_FNAME="Mario"
INIT_ADMIN_LNAME="Viajes"
INIT_WEBSITE_DOMAIN="clearcms.com"
INIT_DEFAULT_EMAIL="admin@example.com"
INIT_DEFAULT_PASSWORD="1qaz"
INIT_TPL_VER="v1"
INIT_CMS_JWT_EXP_H="3600s"
INIT_recaptcha_public_key="6LexYKcgAAAAAJFaubxSmEb8YREOpijCvN7cXTKH"
INIT_recaptcha_private_key="6LexYKcgAAAAAIezbvvoK8awgmECnH7j7YDJsH29"

#TODO MOVE TO AN ENV FILE
INIT_POSTGRES_DEFAULT_USER=cms
INIT_POSTGRES_DEFAULT_PASSWORD=1qaz
INIT_POSTGRES_DEFAULT_DB=main
INIT_POSTGRES_DEFAULT_CONNECTIONS="main,agency"
INIT_PGADMIN_DEFAULT_EMAIL="admin@example.com"
INIT_PGADMIN_DEFAULT_PASSWORD=1qaz
INIT_REDIS_DEFAULT_PASSWORD=1gzHwbgfwR


#cms
USER_APP_NAME=$(promptText "App name (Enter for default:  $INIT_APP_NAME)")
USER_APP_VERSION=$(promptText "App version (Enter for default:  $INIT_APP_VERSION)")
USER_DEFAULT_EMAIL=$(promptText "Admin Email (Enter for default: $INIT_DEFAULT_EMAIL)")
USER_DEFAULT_PASSWORD=$(promptText "Admin Password (Enter for default: $INIT_DEFAULT_PASSWORD)")
USER_WEBSITE_NAME=$(promptText "Website name (Enter for default: $INIT_WEBSITE_NAME)")
USER_WEBSITE_EMAIL=$(promptText "Website email (Enter for default: $INIT_WEBSITE_EMAIL)")
USER_ADMIN_FNAME=$(promptText "Admin first name (Enter for default: $INIT_ADMIN_FNAME)")
USER_ADMIN_LNAME=$(promptText "Admin last name (Enter for default: $INIT_ADMIN_LNAME)")
USER_WEBSITE_DOMAIN=$(promptText "Website domain (Enter for default: $INIT_WEBSITE_DOMAIN)")
USER_TPL_VER=$(promptText "App template E.G. v1 (Enter for default:  $INIT_TPL_VER)")
USER_CMS_JWT_EXP_H=$(promptText "JWT expire time (Enter for default:  $INIT_CMS_JWT_EXP_H)")
USER_recaptcha_public_key=$(promptText "Next JS public recaptcha key (Enter for default:  $INIT_recaptcha_public_key)")
USER_recaptcha_private_key=$(promptText "Recaptcha secret key (Enter for default:  $INIT_recaptcha_private_key)")

#infra
USER_REDIS_DEFAULT_PASSWORD=$(promptSecret "Redis password (Enter for default: $INIT_REDIS_DEFAULT_PASSWORD)")
echo -e "\n*** Secret stored ***\n"
USER_POSTGRES_DEFAULT_USER=$(promptText "Postgres user (Enter for default: $INIT_POSTGRES_DEFAULT_USER)")
USER_POSTGRES_DEFAULT_PASSWORD=$(promptSecret "Postgres password (Enter for default: $INIT_POSTGRES_DEFAULT_PASSWORD)")
echo -e "\n*** Secret stored ***\n"
USER_POSTGRES_DEFAULT_DB=$(promptSecret "Postgres database (Enter for default: $INIT_POSTGRES_DEFAULT_DB)")
USER_POSTGRES_DEFAULT_CONNECTIONS=$(promptText "Postgres Database names (Enter for default: $INIT_POSTGRES_DEFAULT_CONNECTIONS)")
USER_PGADMIN_DEFAULT_EMAIL=$(promptText "PgAdmin email (Enter for default: $INIT_PGADMIN_DEFAULT_EMAIL)")
USER_PGADMIN_DEFAULT_PASSWORD=$(promptSecret "PgAdmin password (Enter for default: $INIT_PGADMIN_DEFAULT_PASSWORD)")
echo -e "\n*** Secret stored ***\n"

export APP_NAME=$([[ -z $USER_APP_NAME ]] && echo $INIT_APP_NAME || echo $USER_APP_NAME)
export APP_VERSION=$([[ -z $USER_APP_VERSION ]] && echo $INIT_APP_VERSION || echo $USER_APP_VERSION)
export DEFAULT_EMAIL=$([[ -z $USER_DEFAULT_EMAIL ]] && echo $INIT_DEFAULT_EMAIL || echo $USER_DEFAULT_EMAIL)
export DEFAULT_PASSWORD=$([[ -z $USER_DEFAULT_PASSWORD ]] && echo $INIT_DEFAULT_PASSWORD || echo $USER_DEFAULT_PASSWORD)
export WEBSITE_NAME=$([[ -z $USER_WEBSITE_NAME ]] && echo $INIT_WEBSITE_NAME || echo $USER_WEBSITE_NAME)
export WEBSITE_EMAIL=$([[ -z $USER_WEBSITE_EMAIL ]] && echo $INIT_WEBSITE_EMAIL || echo $USER_WEBSITE_EMAIL)
export ADMIN_FNAME=$([[ -z $USER_ADMIN_FNAME ]] && echo $INIT_ADMIN_FNAME || echo $USER_ADMIN_FNAME)
export ADMIN_LNAME=$([[ -z $USER_ADMIN_LNAME ]] && echo $INIT_ADMIN_LNAME || echo $USER_ADMIN_LNAME)
export WEBSITE_DOMAIN=$([[ -z $USER_WEBSITE_DOMAIN ]] && echo $INIT_WEBSITE_DOMAIN || echo $USER_WEBSITE_DOMAIN)
export APP_DOMAIN=$([[ -z $USER_APP_DOMAIN ]] && echo $INIT_APP_DOMAIN || echo $USER_APP_DOMAIN)
export TPL_VER=$([[ -z $USER_TPL_VER ]] && echo $INIT_TPL_VER || echo $USER_TPL_VER)
export CMS_JWT_EXP_H=$([[ -z $USER_CMS_JWT_EXP_H ]] && echo $INIT_CMS_JWT_EXP_H || echo $USER_CMS_JWT_EXP_H)
export recaptcha_public_key=$([[ -z $USER_recaptcha_public_key ]] && echo $INIT_recaptcha_public_key || echo $USER_recaptcha_public_key)
export recaptcha_private_key=$([[ -z $USER_recaptcha_private_key ]] && echo $INIT_recaptcha_private_key || echo $USER_recaptcha_private_key)

export REDIS_DEFAULT_PASSWORD=$([[ -z $USER_REDIS_DEFAULT_PASSWORD ]] && echo $INIT_REDIS_DEFAULT_PASSWORD || echo $USER_REDIS_DEFAULT_PASSWORD)

export POSTGRES_DEFAULT_USER=$([[ -z $USER_POSTGRES_DEFAULT_USER ]] && echo $INIT_POSTGRES_DEFAULT_USER || echo $USER_POSTGRES_DEFAULT_USER)
export POSTGRES_DEFAULT_PASSWORD=$([[ -z $USER_POSTGRES_DEFAULT_PASSWORD ]] && echo $INIT_POSTGRES_DEFAULT_PASSWORD || echo $USER_POSTGRES_DEFAULT_PASSWORD)
export POSTGRES_DEFAULT_DB=$([[ -z $USER_POSTGRES_DEFAULT_DB ]] && echo $INIT_POSTGRES_DEFAULT_DB || echo $USER_POSTGRES_DEFAULT_DB)
export POSTGRES_DEFAULT_CONNECTIONS=$([[ -z $USER_POSTGRES_DEFAULT_CONNECTIONS ]] && echo $INIT_POSTGRES_DEFAULT_CONNECTIONS || echo $USER_POSTGRES_DEFAULT_CONNECTIONS)

export PGADMIN_DEFAULT_EMAIL=$([[ -z $USER_PGADMIN_DEFAULT_EMAIL ]] && echo $INIT_PGADMIN_DEFAULT_EMAIL || echo $USER_PGADMIN_DEFAULT_EMAIL)
export PGADMIN_DEFAULT_PASSWORD=$([[ -z $USER_PGADMIN_DEFAULT_PASSWORD ]] && echo $INIT_PGADMIN_DEFAULT_PASSWORD || echo $USER_PGADMIN_DEFAULT_PASSWORD)

export CMS_HUB_VERSION=1675617296
export CMS_DB_VERSION=1675617296
export CMS_BUCKET_VERSION=1675617296
export CMS_ADMIN_PROXY_VERSION=1675617296
export CMS_ADMIN_SYSTEM_VERSION=1675617296
export CMS_FRONTEND_PROXY_VERSION=1675617296
export CMS_FRONTEND_VERSION=1675617296

echo "**************** Starting Services *****************"

echo -e "\n"

echo "../versions/v0.0.1/base.yaml"

docker-compose -f "../versions/v0.0.1/base.yaml" up -d

echo -e "\n"

echo "**************** Services Started *****************"
