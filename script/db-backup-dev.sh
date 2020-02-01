#!/bin/bash

DB_BACKUPS_DIR=/usr/src/db_backups
DATE=$(date +\%Y-\%m-\%d:\%H:\%M:\%S)
DEST=$DB_BACKUPS_DIR/$DATE

mkdir $DEST
cd $DEST

#Dump database into directory
   #mongodump -h IP:PORT -u username -p "password" --authenticationDatabase admin -d catalyst -o $DEST
sudo mongodump --authenticationDatabase admin -d catalyst -o $DEST


#Upload directory to S3 bucket
    #aws s3 cp $DEST s3://catalystnwbackup/db_backups/${DEST:47:19} --recursive
aws s3 cp $DEST s3://catalyst-application-db/db_backups/$DATE . --recursive

aws s3 cp s3://catalyst-application-db/db_backups/devInstance . --recursive

folder=$1

mongorestore $DB_BACKUPS_DIR/$folder/catalyst --authenticationDatabase admin -d catalyst