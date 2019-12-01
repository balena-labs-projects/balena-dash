#!/usr/bin/bash

export DBUS_SYSTEM_BUS_ADDRESS=unix:path=/host/run/dbus/system_bus_socket


sed -i -e 's/console/anybody/g' /etc/X11/Xwrapper.config
echo "needs_root_rights=yes" >> /etc/X11/Xwrapper.config
dpkg-reconfigure xserver-xorg-legacy


# if window size if env is not available, use default 1920,1080
if [[ -z ${WINDOW_SIZE+x} ]]
  then
    echo "Setting Window Size to default"
    export WINDOW_SIZE="1920,1080"
fi


#create start script for X11
echo "#!/bin/bash" > /home/chromium/xstart.sh
# rotate screen if env variable is set [normal, inverted, left or right]
if [[ ! -z "$ROTATE_DISPLAY" ]]; then
  echo "(sleep 3 && xrandr -o $ROTATE_DISPLAY) &" >> /home/chromium/xstart.sh
fi
echo "xset s off -dpms" >> /home/chromium/xstart.sh
echo "chromium --kiosk --app=$LAUNCH_URL  --window-size=$WINDOW_SIZE --autoplay-policy=no-user-gesture-required" >> /home/chromium/xstart.sh
chmod 770 /home/chromium/*.sh 
chown chromium:chromium /home/chromium/xstart.sh


# Start Tohora
cd /home/chromium/tohora && ./tohora 8080 /home/chromium/launch.sh &
# wait for it
sleep 3


# Check if we have a GALLERY_URL set, otherwise load LAUNCH_URL var
if [[ ! -z ${GALLERY_URL} ]]
  then
    echo "Loading gallery"
    LAUNCH_URL="file:///home/chromium/public_html/index.html"
fi


if [[ ! -z ${LAUNCH_URL+x} ]]
  then
    sleep 5
    wget --post-data "url=$LAUNCH_URL" http://localhost:8080/launch/
fi


tail -f /dev/null

while : ; do echo "${MESSAGE=Idling...}"; sleep ${INTERVAL=600}; done