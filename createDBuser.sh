nohup mongod --dbpath /usr/src/db/ &

sleep 1

mongo admin <<EOF
use admin;
db.createUser({ user: '$DB_USERNAME', pwd: '$DB_PASSWORD', roles: [{role:'userAdmin',db:'admin'}]})
exit
EOF