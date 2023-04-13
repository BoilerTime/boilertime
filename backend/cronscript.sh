#!/bin/sh
echo "cron job running"
response=$(curl --silent --request POST http://localhost:3001/api/notifyusers)
echo $response
