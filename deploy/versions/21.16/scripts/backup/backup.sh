RANCHER_CONTAINER_NAME=$(docker ps --format '{{.Image}} {{.ID}}' | grep rancher/rancher | cut -d' ' -f2);
RANCHER_CONTAINER_TAG=$(docker ps --format '{{.Image}}' | grep rancher/rancher | cut -d':' -f2);
RANCHER_CREATED_DATE=$(docker ps --format '{{.Image}} {{.CreatedAt}}' | grep rancher/rancher | cut -d' ' -f2,3 | sed -e "s/ /_/g" | sed -e "s/:/./g");
NOW=$( date +%Y-%m-%d-%H-%M-%S )
BACKUP_PATH="/home/cms/backup/"

echo "RANCHER_CONTAINER_NAME: $RANCHER_CONTAINER_NAME"
echo "RANCHER_CONTAINER_TAG: $RANCHER_CONTAINER_TAG"
echo "RANCHER_CREATED_DATE: $RANCHER_CREATED_DATE"

echo "*** stopping $RANCHER_CONTAINER_NAME ***"
docker stop $RANCHER_CONTAINER_NAME


echo "*** creating backup to rancher-data-backup-$RANCHER_CONTAINER_TAG-$NOW.tar.gz ***"
docker create \
--volumes-from $RANCHER_CONTAINER_NAME \
--name "rancher-data-$RANCHER_CREATED_DATE" \
"rancher/rancher:$RANCHER_CONTAINER_TAG"
docker run \
--volumes-from "rancher-data-$RANCHER_CREATED_DATE" \
-v $PWD:/backup:z \
busybox tar pzcf "/backup/rancher-data-backup-$RANCHER_CONTAINER_TAG-$NOW.tar.gz" /var/lib/rancher

cp ./rancher-data-backup-$RANCHER_CONTAINER_TAG-$NOW.tar.gz $BACKUP_PATH
rm -fr ./rancher-data-backup-$RANCHER_CONTAINER_TAG-$NOW.tar.gz

docker rm "rancher-data-$RANCHER_CREATED_DATE"

docker start $RANCHER_CONTAINER_NAME


#docker run  --volumes-from rancher-data-<DATE> -v $PWD:/backup:z busybox tar pzcvf /backup/rancher-data-backup-<RANCHER_VERSION>-<DATE>.tar.gz /var/lib/rancher