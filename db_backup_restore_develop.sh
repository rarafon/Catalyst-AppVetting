#!/bin/bash
PATH='/home/ubuntu/.nvm/versions/node/v11.10.1/bin:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin:/usr/games:/usr/local/games:/snap/bin'

cd /home/ubuntu/CorvusDev/db_backups/devInstance

#aws s3 cp s3://catalystnwbackup/db_backups . --recursive
sudo aws s3 cp s3://catalyst-application-db/db_backups/devInstance . --recursive

folder=$1

#mongorestore /home/ubuntu/CorvusDev/db_backups/$folder/catalyst -h IP:PORT -u username -p "password" --authenticationDatabase admin -d catalyst
sudo mongorestore /home/ubuntu/CorvusDev/db_backups/devInstance/$folder/catalyst --authenticationDatabase admin -d catalyst