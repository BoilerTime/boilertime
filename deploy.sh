#!/bin/bash
APP_DIR='/root'
IMAGE_NAME='mapldx/boilertime:latest'
CONTAINER_NAME='boilertime'

docker stop $CONTAINER_NAME || true
docker rm $CONTAINER_NAME || true
docker pull $IMAGE_NAME
docker run -d --name $CONTAINER_NAME -p 3002:3002 $IMAGE_NAME