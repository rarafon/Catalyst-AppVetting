#! /bin/bash
BIN_PATH=./node_modules/.bin
MONGOD_PATH=$(which mongod)

$MONGOD_PATH --dbpath /usr/src/db/ --logpath /usr/src/logs/mongod.log &

sleep 2

npm start

# $BIN_PATH/forever start -o /usr/src/logs/nodeOut.log -e /usr/src/logs/nodeErr.log ./bin/www

