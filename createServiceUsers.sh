
mongod --dbpath /usr/src/db/ --logpath /usr/src/logs/init-mongod.log &

sleep 1

mongo admin <<EOF
use admin;
db.createUser({ user: '$DB_USERNAME', pwd: '$DB_PASSWORD', roles: [{role:'userAdmin',db:'admin'}]});
exit
EOF

node createAdminUser &

sleep 4

pkill -2 mongod