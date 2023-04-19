#!/bin/bash
APP_DIR='/root'
JAR_NAME=$(ls -t $APP_DIR/*.jar | head -1 | xargs basename)
PID_FILE="$APP_DIR/app.pid"

if [ -f "$PID_FILE" ]; then
  kill "$(cat "$PID_FILE")"
  rm -f "$PID_FILE"
fi

nohup java -jar "$APP_DIR/$JAR_NAME" > "$APP_DIR/app.log" 2>&1 &
echo $! > "$PID_FILE"