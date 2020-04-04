#! /bin/bash

cd /usr/src/Catalyst-AppVetting/

./script/stop-all.sh
sleep 1
./script/start-all.sh
