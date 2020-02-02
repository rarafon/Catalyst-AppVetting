#! /bin/bash
# This script can be run as following:
#   curl https://raw.githubusercontent.com/dandahle/Catalyst-AppVetting/update-setup/script/curl-init.sh | sudo bash -

set -e 

TITLE="\e[96mInitialization Script for Catalyst AppVetting Tool v0.1.0 by Rohin Adalja\e[0m"
SETUP="\n\e[93mINIT\e[0m"

apt-get update && apt-get install git -y
cd /usr/src
git clone https://github.com/dandahle/Catalyst-AppVetting.git
cd Catalyst-AppVetting/
git checkout update-setup
./script/init-setup.sh