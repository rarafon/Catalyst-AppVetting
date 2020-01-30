#! /bin/bash
set -e 

TITLE="\e[96mSetup Script for Catalyst AppVetting Tool v0.1.0 by Rohin Adalja\e[0m"
SETUP="\e[93mSETUP\e[0m"
EXEC="" #sudo

# ssh ubuntu@18.237.199.143 -i /Users/rohin/Downloads/CatalystDevelopment.pem 
# Pre-requisites: 
#   sudo apt-get update && sudo apt-get install git -y && \
#   cd /usr/src && \
#   sudo git clone https://github.com/dandahle/Catalyst-AppVetting.git && \
#   cd Catalyst-AppVetting/ && \
#   sudo git checkout update-setup && \
#   sudo bash setup.sh

cd ..
echo -e "\n$TITLE\n"
echo -e "$SETUP: Running in $(pwd)"

exit 0
 
echo -e "$SETUP: Making initial app directories..."
$EXEC mkdir db_backups
$EXEC mkdir logs


# Install Pre-Requisite Packages [git, aws-cli]
$EXEC apt-get update && sudo apt-get upgrade -y
$EXEC apt install awscli

# Install Node v12.x.x
echo "
-------------------------------
  ==> INSTALLING NODE v12.x.x
-------------------------------
"

    # fetch nodejs 12 personal package archive from nodesource
curl -sL https://deb.nodesource.com/setup_12.x | sudo -E bash -

    # install nodejs and npm
sudo apt-get install -y nodejs



# Install MongoDB v4.x.x
echo "
-------------------------------
  ==> INSTALLING MONGODB v4.x.x
-------------------------------
"

    # import mongodb 4.0 public gpg key
sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv 9DA31620334BD75D9DCB49F368818C72E52529D4

    # create the /etc/apt/sources.list.d/mongodb-org-4.0.list file for mongodb
echo "deb [ arch=amd64 ] https://repo.mongodb.org/apt/ubuntu bionic/mongodb-org/4.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-4.0.list

    # reload local package database
sudo apt-get update

    # install the latest version of mongodb
sudo apt-get install -y mongodb-org

    # start mongodb
sudo systemctl start mongod

    # Enable systemctl: mongod service - set mongodb to start automatically on system startup
sudo systemctl enable mongod


# Fetch Catalyst AppVetting program files from GitHub Repo
git clone https://github.com/dandahle/Catalyst-AppVetting.git 
    # Ask for branch [Default: master; other options: develop, or custom branch name]
git checkout develop  # Change to variable


# Install Node Modules from package.json
sudo npm install --global
    # Install Global NPM modules Such as [Forever]

# Ask if Wanting to set up Production or Development environment 

# Configure AWS CLI
    #Run aws-cli configure


# Ask if want to restore from a Mongo DB backup or start DB from scratch.
    # Ask for MongoDB configuration to be saved in config

# START Server
sudo ./restart.sh
sudo forever list