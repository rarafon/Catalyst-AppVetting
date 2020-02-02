#! /bin/bash
# This script can be run as following:
#   curl https://raw.githubusercontent.com/dandahle/Catalyst-AppVetting/update-setup/script/init-curl.sh | sudo bash -

set -e 

TITLE="\e[96mInitialization Script for Catalyst AppVetting Tool v0.1.0 by Rohin Adalja\e[0m"
SETUP="\n\e[93mINIT\e[0m"

echo -e "\n$TITLE"
echo -e "$SETUP: Running in $(pwd)"

./script/init-install.sh
./script/init-configure.sh

echo -e "$SETUP: DONE: Init Complete!"