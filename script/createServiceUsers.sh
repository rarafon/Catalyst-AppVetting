#!/bin/bash

mongo admin <<EOF
use admin;
db.createUser({ user: '$DB_USERNAME', pwd: '$DB_PASSWORD', roles: [{role:'userAdmin',db:'admin'}]});
exit
EOF

node ./script/createAdminUser &

sleep 1