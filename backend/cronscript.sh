#!/bin/sh
echo "cron job running"
response=$(curl --silent --request POST https://api.boilerti.me/api/notifyusers)
echo $response
