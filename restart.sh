#! /bin/sh
PATH='/home/ubuntu/.nvm/versions/node/v11.10.1/bin:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin:/usr/games:/usr/local/games:/snap/bin'
##dirname="/Users/Rohin/CorvusDev/Catalyst-Appvetting"
##dir=$(cd -P -- "$(dirname -- "$0")" && pwd -P)

## Run this script from the ~/CorvusDev/Catalyst-Appvetting directory

#sudo mongod --shutdown
#sudo mongod start

#sudo forever stop bin/www
#sudo forever start bin/www

sudo forever stopall

sudo service mongod stop
sudo service mongod start

sudo forever start -o ../logs/nodeOut.log -e ../logs/nodeErr.log ./bin/www