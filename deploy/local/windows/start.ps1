#!/usr/bin/env powershell
$INIT_VERSION = "v0.0.1"
$INIT_APP_NAME = "marioviajes"
$INIT_APP_DOMAIN = "marioviajes.com"
$INIT_TPL_VER = "v1"
$INIT_POSTGRES_DEFAULT_USER = "cms"
$INIT_POSTGRES_DEFAULT_PASSWORD = "1qaz"
$INIT_POSTGRES_DEFAULT_DB = "main"
$INIT_POSTGRES_DEFAULT_CONNECTIONS = "main,agency"
$INIT_PGADMIN_DEFAULT_EMAIL = "admin@localhost.local"
$INIT_PGADMIN_DEFAULT_PASSWORD = "1qaz"
$INIT_REDIS_DEFAULT_PASSWORD = "1gzHwbgfwR"
$CMS_HUB_VERSION="1649163401"
$CMS_DB_VERSION="1649163401"
$CMS_BUCKET_VERSION="1649163401"
$CMS_FRONTEND_PROXY_VERSION="1649163401"
$CMS_FRONTEND_VERSION="1649163401"
$CMS_ADMIN_PROXY_VERSION="1649163401"
$PWD=$pwd.Path

if (($VERSION = Read-Host "Installation revision (Enter for default: $INIT_VERSION )") -eq '') { $VERSION = $INIT_VERSION }

if (($APP_NAME = Read-Host "App name (Enter for default:  $INIT_APP_NAME)") -eq '') { $APP_NAME = $INIT_APP_NAME }
if (($APP_DOMAIN = Read-Host "App domain E.G. example.com (Enter for default:  $INIT_APP_DOMAIN)") -eq '') { $APP_DOMAIN = $INIT_APP_DOMAIN }
if (($TPL_VER = Read-Host "App template E.G. v1 (Enter for default:  $INIT_TPL_VER)") -eq '') { $TPL_VER = $INIT_TPL_VER }

if (($REDIS_DEFAULT_PASSWORD = Read-Host "Redis password (Enter for default:  $INIT_REDIS_DEFAULT_PASSWORD)") -eq '') { $REDIS_DEFAULT_PASSWORD = $INIT_REDIS_DEFAULT_PASSWORD }

if (($POSTGRES_DEFAULT_USER = Read-Host "Postgres user (Enter for default:  $INIT_POSTGRES_DEFAULT_USER)") -eq '') { $POSTGRES_DEFAULT_USER = $INIT_POSTGRES_DEFAULT_USER }
if (($POSTGRES_DEFAULT_PASSWORD = Read-Host "Postgres password (Enter for default: $INIT_POSTGRES_DEFAULT_PASSWORD)") -eq '') { $POSTGRES_DEFAULT_PASSWORD = $INIT_POSTGRES_DEFAULT_PASSWORD }
if (($POSTGRES_DEFAULT_DB = Read-Host "Postgres Database name (Enter for default: $INIT_POSTGRES_DEFAULT_DB)") -eq '') { $POSTGRES_DEFAULT_DB = $INIT_POSTGRES_DEFAULT_DB }
if (($POSTGRES_DEFAULT_CONNECTIONS = Read-Host "Postgres Database names (Enter for default: $INIT_POSTGRES_DEFAULT_CONNECTIONS)") -eq '') { $POSTGRES_DEFAULT_CONNECTIONS = $INIT_POSTGRES_DEFAULT_CONNECTIONS }

if (($PGADMIN_DEFAULT_EMAIL = Read-Host "PgAdmin email (Enter for default: $INIT_PGADMIN_DEFAULT_EMAIL)") -eq '') { $PGADMIN_DEFAULT_EMAIL = $INIT_PGADMIN_DEFAULT_EMAIL }
if (($PGADMIN_DEFAULT_PASSWORD = Read-Host "PgAdmin password (Enter for default: $INIT_PGADMIN_DEFAULT_PASSWORD)") -eq '') { $PGADMIN_DEFAULT_PASSWORD = $INIT_PGADMIN_DEFAULT_PASSWORD }

$env:VERSION=$VERSION
$env:APP_NAME=$APP_NAME
$env:APP_DOMAIN=$APP_DOMAIN
$env:TPL_VER=$TPL_VER

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

$env:PWD=$PWD

echo $PWD


echo "$VERSION"
echo "$APP_NAME"
echo "$APP_DOMAIN"
echo "$TPL_VER"
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

((Get-Content -path ..\..\pg.db\db.schema.sql -Raw) -replace 'admin@localhost.local', $INIT_PGADMIN_DEFAULT_EMAIL) | Set-Content -Path ..\..\pg.db\db.schema.sql
((Get-Content -path ..\..\pg.db\db.schema.sql -Raw) -replace "MD5('1qaz')", "MD5('$PGADMIN_DEFAULT_PASSWORD')") | Set-Content -Path ..\..\pg.db\db.schema.sql

echo "**************** Starting Services *****************"

Write-Output "Login in to docker"

Get-Content ../secrets/dockerpass.txt | docker login --username cmsbot --password-stdin

echo "..\versions\$VERSION\base.yaml"

"docker-compose -f ..\versions\$VERSION\base.yaml up -d" | cmd

echo "**************** Services Started *****************"