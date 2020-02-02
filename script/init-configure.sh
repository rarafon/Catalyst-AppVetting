#! /bin/bash
# This script can be run as following:
#   curl https://raw.githubusercontent.com/dandahle/Catalyst-AppVetting/update-setup/script/init-curl.sh | sudo bash -


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
          vim .env

          sleep 2

          echo -e "$SETUP: Done. Please run ./script/init-setup.sh"
        ;;
esac
