#!/bin/bash

cd ../db_backups

#aws s3 cp s3://catalystnwbackup/db_backups . --recursive
sudo aws s3 cp s3://catalyst-application-db/db_backups . --recursive

folder=$1

#mongorestore /home/ubuntu/CorvusDev/db_backups/$folder/catalyst -h IP:PORT -u username -p "password" --authenticationDatabase admin -d catalyst
sudo mongorestore ~/CorvusDev/db_backups/$folder/catalyst --authenticationDatabase admin -d catalyst