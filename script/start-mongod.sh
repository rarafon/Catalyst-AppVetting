#! /bin/bash
BIN_PATH=./node_modules/.bin

mongod --dbpath /usr/src/db/ --logpath /usr/src/logs/mongod.log &

sleep 1