#! /bin/bash
BIN_PATH=./node_modules/.bin

./script/start-mongod.sh

$BIN_PATH/forever start -o /usr/src/logs/server.log -e /usr/src/logs/server.log ./bin/www
$BIN_PATH/forever logs 0 -f