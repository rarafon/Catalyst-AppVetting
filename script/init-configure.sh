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
          echo -e "$SETUP: Loading... When done, save the file to continue"
          sleep 3

          # Open editor to modify environment variables
          nano .env

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
                  echo -e "\nAVT | Setting up Catalyst Appvetting Tool..."
                  ;;
              *)
                  echo -e "AVT | Cancelled by user, exiting."
                  exit 1
                  ;;
          esac
        ;;
esac


exit 1

# checkout to that branch
git checkout update-setup  # Change to variable



# Install Node Modules from package.json
npm install
    # Install Global NPM modules Such as [Forever]


# Enable systemctl: mongod service - set mongodb to start automatically on system startup
echo -e "$SETUP: Starting MongoDB... (automated startup)"
./script/start-mongod.sh
systemctl enable mongod


./script/createServiceUsers.sh
./script/db-restore-dev.sh


# START Server
sudo ./restart.sh
 ./script/docker-start.sh

sudo forever list

echo -e "$SETUP: DONE: Configuration Complete!"