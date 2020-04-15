#!/bin/bash
pkill xinit

sleep 3

# delete the last two lines in xstart script and replace with new settings
head -n2 < /home/chromium/xstart.sh > /home/chromium/xstart.sh


echo "chromium-browser $1 $FLAGS  --window-size=$WINDOW_SIZE &" >> /home/chromium/xstart.sh
echo "while true; do xdotool keydown ctrl+Tab; xdotool keyup ctrl+Tab; sleep 10; done" >> /home/chromium/xstart.sh


# run script as chromium user
su -c 'export DISPLAY=:0 && startx /home/chromium/xstart.sh -- -nocursor' - chromium