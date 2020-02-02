#! /bin/bash
# This script can be run as following:
#   curl https://raw.githubusercontent.com/dandahle/Catalyst-AppVetting/update-setup/script/init-curl.sh | sudo bash -

set -e 

TITLE="\e[96mCatalyst AppVetting Tool v0.1.0\e[0m"

apt-get update && apt-get install git -y
cd /usr/src
git clone https://github.com/dandahle/Catalyst-AppVetting.git
cd Catalyst-AppVetting/
git checkout update-setup
./script/init.sh