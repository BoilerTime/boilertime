#!/bin/bash
APP_DIR='/root'
IMAGE_NAME='mapldx/boilertime:latest'
CONTAINER_NAME='boilertime'

docker compose down || true
docker pull $IMAGE_NAME
docker compose up -d