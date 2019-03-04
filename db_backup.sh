#!/bin/bash
#PATH='/home/ubuntu/bin:/home/ubuntu/.local/bin:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin:/usr/games:/usr/local/games:/snap/bin'
#To name the directory with the date
DEST=/home/ubuntu/CorvusDev/db_backups/$(date +\%Y-\%m-\%d:\%H:\%M:\%S)

#Create directory
sudo mkdir $DEST

#Dump database into directory
   #mongodump -h IP:PORT -u username -p "password" --authenticationDatabase admin -d catalyst -o $DEST
sudo mongodump --authenticationDatabase admin -d catalyst -o $DEST

#Upload directory to S3 bucket
    #aws s3 cp $DEST s3://catalystnwbackup/db_backups/${DEST:47:19} --recursive
aws s3 cp ~/CorvusDev/s3bak s3://catalyst-application-db/db_backups/${DEST:34:19} --recursive

