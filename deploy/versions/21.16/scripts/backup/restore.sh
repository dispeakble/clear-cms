APP_VERSION="v2.3.7"


RANCHER_CONTAINER_ID=$(docker ps -a --format '{{.Image}} {{.ID}}' | grep rancher/rancher:  | awk 'NR==1;' | cut -d' ' -f2);
RANCHER_CONTAINER_NAME=$(docker ps -a --format '{{.Image}} {{.ID}}' | grep rancher/rancher:  | awk 'NR==1;' | cut -d' ' -f2);
RANCHER_CONTAINER_TAG=$(docker ps --format '{{.Image}}' | grep rancher/rancher: | cut -d':' -f2);
RANCHER_CREATED_DATE=$(docker ps --format '{{.Image}} {{.CreatedAt}}' | grep rancher/rancher: | cut -d' ' -f2);
RANCHER_IMAGE_NAME="rancher/rancher:$APP_VERSION";
CUR_PATH='/home/cms/backup'

echo "RANCHER_CONTAINER_ID: $RANCHER_CONTAINER_ID"
echo "RANCHER_CONTAINER_TAG: $RANCHER_CONTAINER_TAG"
echo "RANCHER_CREATED_DATE: $RANCHER_CREATED_DATE"

RANCHER_BACKUP_FILE=$(ls /home/cms/backup/ -1 | sort -r | awk 'NR==1;')
echo "$CUR_PATH/$RANCHER_BACKUP_FILE"

echo $(ls -lash "/home/cms/backup/$RANCHER_BACKUP_FILE")
cp "/home/cms/backup/$RANCHER_BACKUP_FILE" .

if [ ! -z "$RANCHER_CONTAINER_ID" ]; then

  echo "*** stopping $RANCHER_CONTAINER_ID ***";
  docker stop $RANCHER_CONTAINER_ID

  echo "*** restoring from volume $RANCHER_CONTAINER_ID ***";
  docker run  --volumes-from $RANCHER_CONTAINER_ID -v $PWD:/backup \
  busybox sh -c "rm /var/lib/rancher/* -rf  && \
  tar pzxf /backup/$RANCHER_BACKUP_FILE"

  echo "*** starting $RANCHER_CONTAINER_ID ***";
  docker start $RANCHER_CONTAINER_ID

else

  echo "*** starting new container $RANCHER_IMAGE_NAME ***";
  $RANCHER_CONTAINER_ID = "rancher/rancher:$APP_VERSION"

  docker run $RANCHER_IMAGE_NAME -v $PWD:/backup \
  busybox sh -c "rm /var/lib/rancher/* -rf  && \
  tar pzxf /$RANCHER_BACKUP_FILE"
fi

rm -fr $RANCHER_BACKUP_FILE




