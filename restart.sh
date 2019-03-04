#! /bin/sh

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