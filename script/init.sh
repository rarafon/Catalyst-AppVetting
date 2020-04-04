#! /bin/bash
# This script can be run as following:
#   curl https://raw.githubusercontent.com/dandahle/Catalyst-AppVetting/develop/script/init-curl.sh | sudo bash -

set -e 

TITLE="\e[96mInitialization Script for Catalyst AppVetting Tool v0.1.0 by Rohin Adalja\e[0m"
SETUP="\n\e[93mINIT\e[0m"

echo -e "\n$TITLE"
echo -e "$SETUP: Running in $(pwd)"

./script/init-install.sh
./script/init-configure.sh

echo -e "$SETUP: CONFIGURATION SAVED.\nTO CONTINUE INSTALLATION, RUN:   cd /usr/src/Catalyst-AppVetting && sudo bash ./script/init-setup.sh"