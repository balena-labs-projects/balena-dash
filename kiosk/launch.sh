#!/bin/bash
pkill xinit

sleep 3

# delete the last line in xstart script and replace with new settings
sed -i '$d' /home/chromium/xstart.sh


echo "chromium-browser $FLAGS --app=$1  --window-size=$WINDOW_SIZE" >> /home/chromium/xstart.sh

chown -R chromium:chromium /usr/src/app/settings
rm -f /usr/src/app/settings/SingletonLock

# run script as chromium user
su -c 'export DISPLAY=:0 && startx /home/chromium/xstart.sh -- -nocursor' - chromium
