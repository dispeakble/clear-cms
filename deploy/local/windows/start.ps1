$INIT_VERSION = "v0.0.1"
$INIT_POSTGRES_DEFAULT_USER = "cms"
$INIT_POSTGRES_DEFAULT_PASSWORD = "1qaz"
$INIT_POSTGRES_DEFAULT_DB = "cms"
$INIT_PGADMIN_DEFAULT_EMAIL = "admin@localhost.local"
$INIT_PGADMIN_DEFAULT_PASSWORD = "1qaz"
$INIT_REDIS_DEFAULT_PASSWORD = "1gzHwbgfwR"
$CMS_HUB_VERSION="1642106404"
$CMS_DB_VERSION="1642106404"
$CMS_BUCKET_VERSION="1642106404"
$CMS_FRONTEND_PROXY_VERSION="1642106404"
$CMS_ADMIN_PROXY_VERSION="1642106404"
$PWD=$pwd.Path

if (($VERSION = Read-Host "Installation revision (Enter for default: $INIT_VERSION )") -eq '') { $VERSION = $INIT_VERSION }

if (($REDIS_DEFAULT_PASSWORD = Read-Host "Redis password (Enter for default:  $INIT_REDIS_DEFAULT_PASSWORD)") -eq '') { $REDIS_DEFAULT_PASSWORD = $INIT_REDIS_DEFAULT_PASSWORD }

if (($POSTGRES_DEFAULT_USER = Read-Host "Postgres user (Enter for default:  $INIT_POSTGRES_DEFAULT_USER)") -eq '') { $POSTGRES_DEFAULT_USER = $INIT_POSTGRES_DEFAULT_USER }
if (($POSTGRES_DEFAULT_PASSWORD = Read-Host "Postgres password (Enter for default: $INIT_POSTGRES_DEFAULT_PASSWORD)") -eq '') { $POSTGRES_DEFAULT_PASSWORD = $INIT_POSTGRES_DEFAULT_PASSWORD }
if (($POSTGRES_DEFAULT_DB = Read-Host "Postgres Database name (Enter for default: $INIT_POSTGRES_DEFAULT_DB)") -eq '') { $POSTGRES_DEFAULT_DB = $INIT_POSTGRES_DEFAULT_DB }

if (($PGADMIN_DEFAULT_EMAIL = Read-Host "PgAdmin email (Enter for default: $INIT_PGADMIN_DEFAULT_EMAIL)") -eq '') { $PGADMIN_DEFAULT_EMAIL = $INIT_PGADMIN_DEFAULT_EMAIL }
if (($PGADMIN_DEFAULT_PASSWORD = Read-Host "PgAdmin password (Enter for default: $INIT_PGADMIN_DEFAULT_PASSWORD)") -eq '') { $PGADMIN_DEFAULT_PASSWORD = $INIT_PGADMIN_DEFAULT_PASSWORD }

$env:VERSION=$VERSION

$env:REDIS_DEFAULT_PASSWORD=$REDIS_DEFAULT_PASSWORD

$env:POSTGRES_DEFAULT_USER=$POSTGRES_DEFAULT_USER
$env:POSTGRES_DEFAULT_PASSWORD=$POSTGRES_DEFAULT_PASSWORD
$env:POSTGRES_DEFAULT_DB=$POSTGRES_DEFAULT_DB

$env:PGADMIN_DEFAULT_EMAIL=$PGADMIN_DEFAULT_EMAIL
$env:PGADMIN_DEFAULT_PASSWORD=$PGADMIN_DEFAULT_PASSWORD

$env:CMS_HUB_VERSION=$CMS_HUB_VERSION
$env:CMS_DB_VERSION=$CMS_DB_VERSION
$env:CMS_BUCKET_VERSION=$CMS_BUCKET_VERSION
$env:CMS_FRONTEND_PROXY_VERSION=$CMS_FRONTEND_PROXY_VERSION
$env:CMS_ADMIN_PROXY_VERSION=$CMS_ADMIN_PROXY_VERSION

$env:PWD=$PWD

echo $PWD


echo "$VERSION"
echo "$REDIS_DEFAULT_PASSWORD"
echo "$POSTGRES_DEFAULT_USER"
echo "$POSTGRES_DEFAULT_PASSWORD"
echo "$POSTGRES_DEFAULT_DB"
echo "$PGADMIN_DEFAULT_EMAIL"
echo "$PGADMIN_DEFAULT_PASSWORD"
echo "$CMS_HUB_VERSION"
echo "$CMS_DB_VERSION"
echo "$CMS_BUCKET_VERSION"
echo "$CMS_FRONTEND_PROXY_VERSION"
echo "$CMS_ADMIN_PROXY_VERSION"

((Get-Content -path ..\..\pg.db\db.schema.sql -Raw) -replace 'admin@localhost.local', $INIT_PGADMIN_DEFAULT_EMAIL) | Set-Content -Path ..\..\pg.db\db.schema.sql
((Get-Content -path ..\..\pg.db\db.schema.sql -Raw) -replace "MD5('1qaz')", "MD5('$PGADMIN_DEFAULT_PASSWORD')") | Set-Content -Path ..\..\pg.db\db.schema.sql

#[System.Environment]::SetEnvironmentVariable("VERSION", $VERSION, 'Machine')
#[System.Environment]::SetEnvironmentVariable("REDIS_DEFAULT_PASSWORD", $REDIS_DEFAULT_PASSWORD, 'Machine')
#[System.Environment]::SetEnvironmentVariable("POSTGRES_DEFAULT_USER", $POSTGRES_DEFAULT_USER, 'Machine')
#[System.Environment]::SetEnvironmentVariable("POSTGRES_DEFAULT_PASSWORD", $POSTGRES_DEFAULT_PASSWORD, 'Machine')
#[System.Environment]::SetEnvironmentVariable("POSTGRES_DEFAULT_DB", $POSTGRES_DEFAULT_DB, 'Machine')
#[System.Environment]::SetEnvironmentVariable("PGADMIN_DEFAULT_EMAIL", $PGADMIN_DEFAULT_EMAIL, 'Machine')
#[System.Environment]::SetEnvironmentVariable("PGADMIN_DEFAULT_PASSWORD", $PGADMIN_DEFAULT_PASSWORD, 'Machine')

echo "**************** Starting Services *****************"

Write-Output "Login in to docker"

Get-Content ../secrets/dockerpass.txt | docker login --username cmsbot --password-stdin

echo "..\versions\$VERSION\base.yaml"

"docker-compose -f ..\versions\$VERSION\base.yaml up -d" | cmd

echo "**************** Services Started *****************"