#!/usr/bin/env powershell
Param ([Boolean]$custom = 0)

$INSTALL_VERSION="v0.0.1"
$APP_NAME = "marioviajes"
$APP_VERSION = "1.5.0"
$WEBSITE_NAME = "Mario Viajes"
$WEBSITE_EMAIL = "contact@marioviajes.com"
$ADMIN_FNAME = "Mario"
$ADMIN_LNAME = "Viajes"
$WEBSITE_DOMAIN = "marioviajes.com"
$DEFAULT_EMAIL = "admin@example.com"
$DEFAULT_PASSWORD = "1qaz"
$TPL_VER = "v1"
$CMS_JWT_EXP_H="3600s"
$recaptcha_public_key="6LdNqsESAAAAAPHt1ZG6vr4RBQHoM-eVcE4XB4wJ"
$recaptcha_private_key="6LdNqsESAAAAANbWPLowt17zjEwNS4MuvVLfX7TQ"
$POSTGRES_DEFAULT_USER = "cms"
$POSTGRES_DEFAULT_PASSWORD = "1qaz"
$POSTGRES_DEFAULT_DB = "main"
$POSTGRES_DEFAULT_CONNECTIONS = "main,agency"
$PGADMIN_DEFAULT_EMAIL = "admin@example.com"
$PGADMIN_DEFAULT_PASSWORD = "1qaz"
$REDIS_DEFAULT_PASSWORD = "1gzHwbgfwR"
$BUCKET_PATH="./volumes/cms/bucket"
$CMS_HUB_VERSION="1675617296"
$CMS_DB_VERSION="1675617296"
$CMS_BUCKET_VERSION="1675617296"
$CMS_FRONTEND_PROXY_VERSION="1675617296"
$CMS_FRONTEND_VERSION="1675617296"
$CMS_ADMIN_PROXY_VERSION="1675617296"
$CMS_ADMIN_SYSTEM_VERSION="1675617296"
$PWD=Get-Location



if($custom) {
    echo "Will do a custom build: "
    if (($user_input = Read-Host "Install version (Enter for default:  $INIT_INSTALL_VERSION)") -ne '') { $INSTALL_VERSION = $user_input}
    if (($user_input = Read-Host "App name (Enter for default:  $INIT_APP_NAME)") -ne '') { $APP_NAME = $user_input}
    if (($user_input = Read-Host "App version (Enter for default:  $INIT_APP_VERSION)") -ne '') { $APP_VERSION = $user_input}
    if (($user_input = Read-Host "Admin Email (Enter for default: $INIT_DEFAULT_EMAIL)") -ne '') { $DEFAULT_EMAIL = $user_input}
    if (($user_input = Read-Host "Admin Password (Enter for default: $INIT_DEFAULT_PASSWORD)") -ne '') { $DEFAULT_PASSWORD = $user_input}
    if (($user_input = Read-Host "Website name (Enter for default: $INIT_WEBSITE_NAME)") -ne '') { $WEBSITE_NAME = $user_input}
    if (($user_input = Read-Host "Website email (Enter for default: $INIT_WEBSITE_EMAIL)") -ne '') { $WEBSITE_EMAIL = $user_input}
    if (($user_input = Read-Host "Admin first name (Enter for default: $INIT_ADMIN_FNAME)") -ne '') { $ADMIN_FNAME = $user_input}
    if (($user_input = Read-Host "Admin last name (Enter for default: $INIT_ADMIN_LNAME)") -ne '') { $ADMIN_LNAME = $user_input}
    if (($user_input = Read-Host "Website domain (Enter for default: $INIT_WEBSITE_DOMAIN)") -ne '') { $WEBSITE_DOMAIN = $user_input}
    if (($user_input = Read-Host "App template E.G. v1 (Enter for default:  $INIT_TPL_VER)") -ne '') { $TPL_VER = $user_input}
    if (($user_input = Read-Host "JWT expire time (Enter for default:  $CMS_JWT_EXP_H)") -ne '') { $CMS_JWT_EXP_H = $user_input}
    if (($user_input = Read-Host "Next JS public recaptcha key (Enter for default:  $INIT_recaptcha_public_key)") -ne '') { $recaptcha_public_key = $user_input}
    if (($user_input = Read-Host "Recaptcha secret key (Enter for default:  $INIT_recaptcha_private_key)") -ne '') { $recaptcha_private_key = $user_input}

    if (($user_input = Read-Host "Redis password (Enter for default:  $INIT_REDIS_DEFAULT_PASSWORD)") -ne '') { $REDIS_DEFAULT_PASSWORD = $user_input}
    if (($user_input = Read-Host "Postgres user (Enter for default:  $INIT_POSTGRES_DEFAULT_USER)") -ne '') { $POSTGRES_DEFAULT_USER = $user_input}
    if (($user_input = Read-Host "Postgres password (Enter for default: $INIT_POSTGRES_DEFAULT_PASSWORD)") -ne '') { $POSTGRES_DEFAULT_PASSWORD = $user_input}
    if (($user_input = Read-Host "Postgres Database name (Enter for default: $INIT_POSTGRES_DEFAULT_DB)") -ne '') { $POSTGRES_DEFAULT_DB = $user_input}
    if (($user_input = Read-Host "Postgres Databases (Enter for default: $INIT_POSTGRES_DEFAULT_CONNECTIONS)") -ne '') { $POSTGRES_DEFAULT_CONNECTIONS = $user_input}

    if (($user_input = Read-Host "PgAdmin email (Enter for default: $INIT_PGADMIN_DEFAULT_EMAIL)") -ne '') { $PGADMIN_DEFAULT_EMAIL = $user_input}
    if (($user_input = Read-Host "PgAdmin password (Enter for default: $INIT_PGADMIN_DEFAULT_PASSWORD)") -ne '') { $PGADMIN_DEFAULT_PASSWORD = $user_input}
}

$env:APP_NAME=$APP_NAME
$env:INSTALL_VERSION=$INSTALL_VERSION
$env:APP_VERSION=$APP_VERSION
$env:DEFAULT_EMAIL=$DEFAULT_EMAIL
$env:DEFAULT_PASSWORD=$DEFAULT_PASSWORD
$env:WEBSITE_NAME=$WEBSITE_NAME
$env:WEBSITE_EMAIL=$WEBSITE_EMAIL
$env:ADMIN_FNAME=$ADMIN_FNAME
$env:ADMIN_LNAME=$ADMIN_LNAME
$env:WEBSITE_DOMAIN=$WEBSITE_DOMAIN
$env:APP_DOMAIN=$APP_DOMAIN
$env:TPL_VER=$TPL_VER
$env:CMS_JWT_EXP_H=$CMS_JWT_EXP_H
$env:recaptcha_public_key=$recaptcha_public_key
$env:recaptcha_private_key=$recaptcha_private_key

$env:REDIS_DEFAULT_PASSWORD=$REDIS_DEFAULT_PASSWORD

$env:POSTGRES_DEFAULT_USER=$POSTGRES_DEFAULT_USER
$env:POSTGRES_DEFAULT_PASSWORD=$POSTGRES_DEFAULT_PASSWORD
$env:POSTGRES_DEFAULT_DB=$POSTGRES_DEFAULT_DB
$env:POSTGRES_DEFAULT_CONNECTIONS=$POSTGRES_DEFAULT_CONNECTIONS

$env:PGADMIN_DEFAULT_EMAIL=$PGADMIN_DEFAULT_EMAIL
$env:PGADMIN_DEFAULT_PASSWORD=$PGADMIN_DEFAULT_PASSWORD

$env:CMS_HUB_VERSION=$CMS_HUB_VERSION
$env:CMS_DB_VERSION=$CMS_DB_VERSION
$env:CMS_BUCKET_VERSION=$CMS_BUCKET_VERSION
$env:CMS_FRONTEND_PROXY_VERSION=$CMS_FRONTEND_PROXY_VERSION
$env:CMS_FRONTEND_VERSION=$CMS_FRONTEND_VERSION
$env:CMS_ADMIN_PROXY_VERSION=$CMS_ADMIN_PROXY_VERSION
$env:CMS_ADMIN_SYSTEM_VERSION=$CMS_ADMIN_SYSTEM_VERSION

$env:BUCKET_PATH=$BUCKET_PATH
$env:PWD=$PWD

echo "$BUCKET_PATH"
echo "$PWD"

echo "$INSTALL_VERSION"
echo "$APP_NAME"
echo "$APP_VERSION"
echo "$DEFAULT_EMAIL"
echo "$DEFAULT_PASSWORD"
echo "$WEBSITE_NAME"
echo "$WEBSITE_EMAIL"
echo "$ADMIN_FNAME"
echo "$ADMIN_LNAME"
echo "$WEBSITE_DOMAIN"
echo "$APP_DOMAIN"
echo "$TPL_VER"
echo "$CMS_JWT_EXP_H"
echo "$recaptcha_public_key"
echo "$recaptcha_private_key"
echo "$REDIS_DEFAULT_PASSWORD"
echo "$POSTGRES_DEFAULT_USER"
echo "$POSTGRES_DEFAULT_PASSWORD"
echo "$POSTGRES_DEFAULT_DB"
echo "$POSTGRES_DEFAULT_CONNECTIONS"
echo "$PGADMIN_DEFAULT_EMAIL"
echo "$PGADMIN_DEFAULT_PASSWORD"
echo "$CMS_HUB_VERSION"
echo "$CMS_DB_VERSION"
echo "$CMS_BUCKET_VERSION"
echo "$CMS_FRONTEND_PROXY_VERSION"
echo "$CMS_FRONTEND_VERSION"
echo "$CMS_ADMIN_PROXY_VERSION"
echo "$CMS_ADMIN_SYSTEM_VERSION"

echo "**************** Starting Services *****************"

Write-Output "Login in to docker"

Get-Content ../secrets/dockerpass.txt | docker login --username cmsbot --password-stdin

echo "..\versions\$INSTALL_VERSION\base.yaml"

"docker-compose -f ..\versions\$INSTALL_VERSION\base.yaml up -d" | cmd

echo "**************** Services Started *****************"