#! /bin/bash
# This script can be run as following: 
#   curl https://raw.githubusercontent.com/dandahle/Catalyst-AppVetting/update-setup/script/init-curl.sh | sudo bash -


CONTINUE=$1
TITLE="\e[96mSetup Script for Catalyst AppVetting Tool\e[0m"
SETUP="\n\e[93mSETUP\e[0m"

echo -e "\n$TITLE"
echo -e "$SETUP: Running in $(pwd)"
          
echo -e "$SETUP: Confirm your installation configuration..."

# Source the .env file
set -x
source .env
set +x

echo -e "\tAVT_ENVIRONMENT: $AVT_ENVIRONMENT"
echo -e "\tAVT_GIT_BRANCH: $AVT_GIT_BRANCH"
echo -e "\tAVT_RESTORE_FROM_BACKUP: $AVT_RESTORE_FROM_BACKUP"
echo -e "\tAWS_ACCESS_KEY_ID: $AWS_ACCESS_KEY_ID"
echo -e "\tAWS_SECRET_ACCESS_KEY: $AWS_SECRET_ACCESS_KEY"
echo -e "\tAWS_S3_BUCKET: $AWS_S3_BUCKET"
echo -e "\tAWS_DEFAULT_REGION: $AWS_DEFAULT_REGION"
echo -e "\tCATALYST_USER_EMAIL: $CATALYST_USER_EMAIL"
echo -e "\tCATALYST_USER_PASSWORD: $CATALYST_USER_PASSWORD"
echo -e "\tCATALYST_USER_FIRST_N: $CATALYST_USER_FIRST_N"
echo -e "\tCATALYST_USER_LAST_N: $CATALYST_USER_LAST_N"
echo -e "\tDB_USERNAME: $DB_USERNAME"
echo -e "\tDB_PASSWORD: $DB_PASSWORD\n"

echo -e "Note: If you do not see a confirmation prompt next, run:\n   cd /usr/src/Catalyst-AppVetting && sudo bash ./script/init-setup.sh\n"

read -e -r -p "Press Enter to continue..." response
read -e -r -p "Are you sure? [y/N] " someAns
case "$someAns" in
    [yY][eE][sS]|[yY]) 
        echo -e "$SETUP: Setting up Catalyst Appvetting Tool..."
        ;;
    *)
        echo -e "$SETUP: Cancelled by user, exiting."
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
if [ -x "$(command -v systemctl)" ]; then
  systemctl enable mongod
fi

./script/start-mongod.sh

sleep 3
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