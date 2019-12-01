#!/bin/bash
pkill xinit

sleep 3

sed -i '$d' /home/chromium/xstart.sh

echo "chromium --kiosk --app=$1  --window-size=$WINDOW_SIZE --start-fullscreen --autoplay-policy=no-user-gesture-required" >> /home/chromium/xstart.sh



su -c 'export DISPLAY=:0 && startx /home/chromium/xstart.sh -- -nocursor' - chromium