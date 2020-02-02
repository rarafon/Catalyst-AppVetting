#! /bin/bash
set -e 

TITLE="\e[96mSetup Script for Catalyst AppVetting Tool v0.1.0 by Rohin Adalja\e[0m"
SETUP="\n\e[93mSETUP\e[0m"

cd ..
echo -e "\n$TITLE"
echo -e "$SETUP: Running in $(pwd)"

exit 1

# Create folders under /usr/src
echo -e "$SETUP: Making initial app directories..."
echo -e "$SETUP: Creating 'db_backups' folder"
$EXEC mkdir db_backups
echo -e "$SETUP: Creating 'logs' folder"
$EXEC mkdir logs
 
echo -e "$SETUP: Updating Ubuntu OS 18.04 Packages..."
$EXEC apt-get update
$EXEC apt-get upgrade -y
$EXEC apt-get install -y git gnupg curl 

# Install AWS Command Line Interface
echo -e "$SETUP: Installing AWS CLI..."
$EXEC apt-get install -y awscli

# Install Node v12.x.x
echo -e "$SETUP: Installing Node v12..."
$EXEC curl -sL https://deb.nodesource.com/setup_12.x | bash -
$EXEC apt-get install -y nodejs

# Install MongoDB v4.x.x
echo -e "$SETUP: Installing MongoDB v4..."
    # import mongoDB 4.0 public gpg key
$EXEC apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv 9DA31620334BD75D9DCB49F368818C72E52529D4
    # create the /etc/apt/sources.list.d/mongodb-org-4.0.list file for mongodb
echo "deb [ arch=amd64 ] https://repo.mongodb.org/apt/ubuntu bionic/mongodb-org/4.0 multiverse" | $EXEC tee /etc/apt/sources.list.d/mongodb-org-4.0.list
    # install mongoDB
$EXEC apt-get update && $EXEC DEBIAN_FRONTEND=noninteractive apt-get install -y mongodb-org
    # Enable systemctl: mongod service - set mongodb to start automatically on system startup
echo -e "$SETUP: Starting MongoDB... (automated startup)"
$EXEC systemctl enable mongod

# # Fetch Catalyst AppVetting program files from GitHub Repo
# git clone https://github.com/dandahle/Catalyst-AppVetting.git 

# Ask for branch [Default: master; other options: develop, or custom branch name]

git checkout update-setup  # Change to variable

pwd
exit 0

# Install Node Modules from package.json
sudo npm install -g
    # Install Global NPM modules Such as [Forever]

# Ask if Wanting to set up Production or Development environment 

# Configure AWS CLI
    #Run aws-cli configure


# Ask if want to restore from a Mongo DB backup or start DB from scratch.
    # Ask for MongoDB configuration to be saved in config

# START Server
sudo ./restart.sh
sudo forever list