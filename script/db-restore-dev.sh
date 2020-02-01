#!/bin/bash

DB_BACKUPS_DIR=/usr/src/db_backups
cd $DB_BACKUPS_DIR

aws s3 cp s3://catalyst-application-db/db_backups/devInstance . --recursive

folder=$1

mongorestore $DB_BACKUPS_DIR/$folder/catalyst --authenticationDatabase admin -d catalyst