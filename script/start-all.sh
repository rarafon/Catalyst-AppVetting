#! /bin/bash

cd /usr/src/Catalyst-AppVetting/

./script/start-mongod.sh
sleep 1
./script/start-node.sh