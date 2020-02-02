#! /bin/bash
# This script can be run as following:
#   curl https://raw.githubusercontent.com/dandahle/Catalyst-AppVetting/update-setup/script/init-curl.sh | sudo bash -

set -e 

CONTINUE=$1
TITLE="\e[96mConfiguration Script for Catalyst AppVetting Tool\e[0m"
SETUP="\n\e[93mCONFIGURE\e[0m"

echo -e "\n$TITLE"
echo -e "$SETUP: Running in $(pwd)"

# Ask env vars - including branch and set it in env and source it
case "$CONTINUE" in
    [-][yY][eE][sS]|[yY]) 
        echo -e "\nAVT | Automated Run: Reading configuration from .env!"
        ;;
    *)
          echo -e "$SETUP: Let's set up the environment configuration..."
          echo -e "$SETUP: Soon: Press [a] to edit. When done, save the file to continue by typing [ESC] :wq!"
          echo -e "$SETUP: Opening..."
          sleep 3

          # Open editor to modify environment variables
          chmod 777 .env
          vi .env

          sleep 2
          echo -e "$SETUP: Confirm your installation configuration..."

          # Source the .env file
          set -a
          source .env
          set +a

          echo -e "
            AVT_ENVIRONMENT: $AVT_ENVIRONMENT
            AVT_GIT_BRANCH: $AVT_GIT_BRANCH
            AVT_RESTORE_FROM_BACKUP: $AVT_RESTORE_FROM_BACKUP
            AWS_ACCESS_KEY_ID: $AWS_ACCESS_KEY_ID
            AWS_SECRET_ACCESS_KEY: $AWS_SECRET_ACCESS_KEY
            AWS_S3_BUCKET: $AWS_S3_BUCKET
            AWS_DEFAULT_REGION: $AWS_DEFAULT_REGION
            CATALYST_USER_EMAIL: $CATALYST_USER_EMAIL
            CATALYST_USER_PASSWORD: $CATALYST_USER_PASSWORD
            CATALYST_USER_FIRST_N: $CATALYST_USER_FIRST_N
            CATALYST_USER_LAST_N: $CATALYST_USER_LAST_N
            DB_USERNAME: $DB_USERNAME
            DB_PASSWORD: $DB_PASSWORD
          "

          read -r -p "Are you sure? [y/N] " response
          case "$response" in
              [yY][eE][sS]|[yY]) 
                  echo -e "$SETUP: Setting up Catalyst Appvetting Tool..."
                  ;;
              *)
                  echo -e "$SETUP: Cancelled by user, exiting."
                  exit 1
                  ;;
          esac
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