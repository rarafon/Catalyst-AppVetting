#! /bin/bash

set -e

[ -d /usr/src/logs ] || mkdir /usr/src/logs/
touch /usr/src/logs/cron_s3.log

command="/usr/src/Catalyst-AppVetting/script/db-backup.sh >> /usr/src/logs/cron_s3.log 2>&1"
job="00 23 * * * $command"
cat <(fgrep -i -v "$command" <(crontab -l)) <(echo "$job") | crontab -
