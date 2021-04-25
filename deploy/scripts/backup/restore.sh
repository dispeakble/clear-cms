RANCHER_CONTAINER_NAME=$(docker ps -a --format '{{.Image}} {{.Names}}' | grep rancher/rancher: | cut -d' ' -f2);
RANCHER_CONTAINER_TAG=$(docker ps --format '{{.Image}}' | grep rancher/rancher: | cut -d':' -f2);
RANCHER_CREATED_DATE=$(docker ps --format '{{.Image}} {{.CreatedAt}}' | grep rancher/rancher: | cut -d' ' -f2);
CUR_PATH='/backup/backups'

echo $RANCHER_CONTAINER_NAME
echo $RANCHER_CONTAINER_TAG
echo $RANCHER_CREATED_DATE

RANCHER_BACKUP_FILE=$(ls ./backups -1 | sort -r | awk 'NR==1;')
echo "$CUR_PATH/$RANCHER_BACKUP_FILE"

echo $(ls -lash "./backups/$RANCHER_BACKUP_FILE")



docker stop $RANCHER_CONTAINER_NAME

docker run  --volumes-from $RANCHER_CONTAINER_NAME -v $PWD:/backup \
busybox sh -c "rm /var/lib/rancher/* -rf  && \
tar pzxf $CUR_PATH/$RANCHER_BACKUP_FILE"

docker start $RANCHER_CONTAINER_NAME

