#!/bin/bash

date=$(date '+%Y-%m-%d %H:%M:%S')
# clean up the log file
echo "$date" > /usr/src/scripts/log.txt
# clean up error log file
echo "" > /usr/src/scripts/error.log
echo "Init DB" >> /usr/src/scripts/log.txt
mysql -uroot -p${MYSQL_ROOT_PASSWORD} < /usr/src/scripts/sql/create-db.sql >> /usr/src/scripts/log.txt 2>>/usr/src/scripts/error.log
echo "DB creation done" >> /usr/src/scripts/log.txt
