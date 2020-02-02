#! /bin/bash
# This script can be run as following:
#   curl https://raw.githubusercontent.com/dandahle/Catalyst-AppVetting/update-setup/script/init-curl.sh | sudo bash -

set -e 

TITLE="\e[96mConfiguration Script for Catalyst AppVetting Tool v0.1.0 by Rohin Adalja\e[0m"
SETUP="\n\e[93mCONFIGURE\e[0m"

echo -e "\n$TITLE"
echo -e "$SETUP: Running in $(pwd)"

# Ask env vars - including branch and set it in env and source it



pwd
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