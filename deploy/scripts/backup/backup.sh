RANCHER_CONTAINER_NAME=$(docker ps --format '{{.Image}} {{.Names}}' | grep rancher/rancher | cut -d' ' -f2);
RANCHER_CONTAINER_TAG=$(docker ps --format '{{.Image}}' | grep rancher/rancher | cut -d':' -f2);
RANCHER_CREATED_DATE=$(docker ps --format '{{.Image}} {{.CreatedAt}}' | grep rancher/rancher | cut -d' ' -f2,3 | sed -e "s/ /_/g" | sed -e "s/:/./g");
NOW=$( date +%Y-%m-%d-%H-%M-%S )

echo $RANCHER_CONTAINER_NAME
echo $RANCHER_CONTAINER_TAG
echo $RANCHER_CREATED_DATE


docker stop $RANCHER_CONTAINER_NAME

docker create \
--volumes-from $RANCHER_CONTAINER_NAME \
--name "rancher-data-$RANCHER_CREATED_DATE" \
"rancher/rancher:$RANCHER_CONTAINER_TAG"
docker run \
--volumes-from "rancher-data-$RANCHER_CREATED_DATE" \
-v $PWD:/backup:z \
busybox tar pzcf "/backup/backups/rancher-data-backup-$RANCHER_CONTAINER_TAG-$NOW.tar.gz" /var/lib/rancher

docker rm -f "rancher-data-$RANCHER_CREATED_DATE"

docker start $RANCHER_CONTAINER_NAME