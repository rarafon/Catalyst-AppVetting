#! /bin/bash
# This script can be run as following:
#   curl https://raw.githubusercontent.com/dandahle/Catalyst-AppVetting/develop/script/init-curl.sh | sudo bash -

set -e 

TITLE="\e[96mCatalyst AppVetting Tool v0.1.0\e[0m"

apt-get update && apt-get install git -y

echo -e "\n$TITLE"
cd /usr/src

if [ -d Catalyst-AppVetting ]; then
  echo -e "\nERROR: Not a fresh install: '/usr/src/Catalyst-AppVetting' already exists! Quitting.\n" 
  exit 1
fi

git clone https://github.com/dandahle/Catalyst-AppVetting.git
cd Catalyst-AppVetting/
git checkout develop
./script/init.sh