#! /bin/bash
#BIN_PATH=./node_modules/.bin

if [ -x "$(command -v systemctl)" ]; then
  systemctl stop mongod
else
  pkill -2 mongod
fi

sleep 1