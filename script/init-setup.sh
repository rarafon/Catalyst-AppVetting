#! /bin/bash
# This script can be run as following: 
#   export AVT_GIT_BRANCH=develop && curl https://raw.githubusercontent.com/dandahle/Catalyst-AppVetting/${AVT_GIT_BRANCH}/script/init-curl.sh | sudo bash -


CONTINUE=$1
TITLE="\e[96mSetup Script for Catalyst AppVetting Tool\e[0m"
SETUP="\n\e[93mSETUP\e[0m"

echo -e "\n$TITLE"
echo -e "$SETUP: Running in $(pwd)"

echo -e "$SETUP: Confirm your installation configuration..."

# Source the .env file
set -a
source .env
set +a

echo -e "\tAWS_ACCESS_KEY_ID: $AWS_ACCESS_KEY_ID"
echo -e "\tAWS_SECRET_ACCESS_KEY: $AWS_SECRET_ACCESS_KEY"
echo -e "\tAWS_S3_RESTORE_BUCKET: $AWS_S3_RESTORE_BUCKET"
echo -e "\tAWS_S3_BACKUP_BUCKET: $AWS_S3_BACKUP_BUCKET"
echo -e "\tAWS_DEFAULT_REGION: $AWS_DEFAULT_REGION"
echo -e "\tAVT_GIT_BRANCH: $AVT_GIT_BRANCH"
echo -e "\tAVT_RESTORE_FROM_BACKUP: $AVT_RESTORE_FROM_BACKUP"
echo -e "\tAVT_RESTORE_FROM_BACKUP_FOLDER: $AVT_RESTORE_FROM_BACKUP_FOLDER"
echo -e "\tAVT_SERVER_PORT: $AVT_SERVER_PORT"
echo -e "\tCATALYST_USER_EMAIL: $CATALYST_USER_EMAIL"
echo -e "\tCATALYST_USER_PASSWORD: $CATALYST_USER_PASSWORD"
echo -e "\tDB_USERNAME: $DB_USERNAME"
echo -e "\tDB_PASSWORD: $DB_PASSWORD"
echo -e "\tAVT_ENVIRONMENT: $AVT_ENVIRONMENT"
echo -e "\tCATALYST_USER_FIRST_N: $CATALYST_USER_FIRST_N"
echo -e "\tCATALYST_USER_LAST_N: $CATALYST_USER_LAST_N"
echo -e "\tDB_AUTHSOURCE: $DB_AUTHSOURCE"
echo -e "\tDB_HOST: $DB_HOST"
echo -e "\tDB_PORT: $DB_PORT"
echo -e "\tDB_NAME: $DB_NAME"
echo -e ""

read -e -r -p "Do you want to install with the above settings? [y/N] " someAns
case "$someAns" in
    [yY][eE][sS]|[yY]) 
        echo -e "$SETUP: Setting up Catalyst Appvetting Tool..."
        ;;
    *)
        echo -e "$SETUP: First, edit the .env file to your liking.\nTHEN, run:\n   cd /usr/src/Catalyst-AppVetting && sudo bash ./script/init-setup.sh\n"
        exit 1
        ;;
esac


# checkout to that branch
echo -e "$SETUP: Checking out $AVT_GIT_BRANCH"
git checkout $AVT_GIT_BRANCH  # Change to variable

# Install Node Modules from package.json
echo -e "$SETUP: Running NPM Install..."
npm install

# Enable systemctl: mongod service - set mongodb to start automatically on system startup
echo -e "$SETUP: Starting MongoDB..."
# if [ -x "$(command -v systemctl)" ]; then
#   systemctl enable mongod
# fi

./script/start-mongod.sh

sleep 4
echo -e "$SETUP: Finalizing: Creating DB and AVT Service Users"
./script/createServiceUsers.sh

./script/db-restore.sh

echo -e "$SETUP: Finalizing: Setting up Automated Backups [using crontab] to S3"
./script/init-crontab.sh

echo -e "AVT | DONE: Cron Job Set Successfully"
echo -e "$SETUP: DONE: Configuration Complete!"
echo -e "AVT | Do you want to start the web-application tool?\n"


read -r -p "Are you sure? [y/N] " startup
case "$startup" in
    [yY][eE][sS]|[yY]) 
        echo -e "AVT | Starting Node.js..."
        ;;
    *)
        echo -e "$SETUP: Cancelled by user, exiting. Run NPM START manually when ready."
        exit 1
        ;;
esac

# START Node.js
./script/start-node.sh