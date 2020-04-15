#!/usr/bin/bash

# check GPU mem setting for Raspberry Pi
if [[ $BALENA_DEVICE_TYPE == *"raspberry"* ]]; 
  then
  if [ "$(vcgencmd get_mem gpu | grep -o '[0-9]\+')" -lt 128 ]
    then
      echo -e "\033[91mWARNING: GPU MEMORY TOO LOW"
  fi
fi

export DBUS_SYSTEM_BUS_ADDRESS=unix:path=/host/run/dbus/system_bus_socket


sed -i -e 's/console/anybody/g' /etc/X11/Xwrapper.config
echo "needs_root_rights=yes" >> /etc/X11/Xwrapper.config
dpkg-reconfigure xserver-xorg-legacy

#Set whether to run Chromium in config mode or not
if [ ! -z ${CONFIG_MODE+x} ] && [ "$CONFIG_MODE" -eq "1" ]
  then
    export KIOSK=''
    echo "Enabling config mode"
    export CHROME_LAUNCH_URL="$LAUNCH_URL"
  else
   export KIOSK='--kiosk --start-fullscreen'
    echo "Disabling config mode"
    export CHROME_LAUNCH_URL="--app=$LAUNCH_URL"
fi

# if FLAGS env var is not set, use default 
if [[ -z ${FLAGS+x} ]]
  then
    echo "Using default chromium flags"
    export FLAGS=" $KIOSK --disable-dev-shm-usage --ignore-gpu-blacklist --enable-gpu-rasterization --force-gpu-rasterization --autoplay-policy=no-user-gesture-required --user-data-dir=/usr/src/app/settings --enable-features=WebRTC-H264WithOpenH264FFmpeg"
fi

#create start script for X11
echo "#!/bin/bash" > /home/chromium/xstart.sh

# rotate screen if env variable is set [normal, inverted, left or right]
if [[ ! -z "$ROTATE_DISPLAY" ]]; then
  echo "(sleep 3 && xrandr -o $ROTATE_DISPLAY) &" >> /home/chromium/xstart.sh
fi

# if no window size has been specified, find the framebuffer size and use that
if [[ -z ${WINDOW_SIZE+x} ]]
  then
    export WINDOW_SIZE=$( cat /sys/class/graphics/fb0/virtual_size )
    echo "Using fullscreen: $WINDOW_SIZE"
fi

echo "xset s off -dpms" >> /home/chromium/xstart.sh
echo "chromium-browser $CHROME_LAUNCH_URL $FLAGS  --window-size=$WINDOW_SIZE" >> /home/chromium/xstart.sh

chmod 770 /home/chromium/*.sh 
chown chromium:chromium /home/chromium/xstart.sh


# Start Tohora
cd /home/chromium/tohora && ./tohora 8080 /home/chromium/launch.sh &
# wait for it
sleep 3

if [ ! -z ${CONTROL_TV+x} ] && [ "$CONTROL_TV" -eq "1" ]
  then
    #Set the TV input to the Pi
    echo 'as' | cec-client -s -d 1
fi

# Check if we have a GALLERY_URL set, otherwise load LAUNCH_URL var
if [[ ! -z ${GALLERY_URL} ]]
  then
    echo "Loading gallery"
    LAUNCH_URL="file:///home/chromium/public_html/index.html"
fi


if [[ ! -z ${LAUNCH_URL+x} ]]
  then
    sleep 5
    wget --post-data "url=$LAUNCH_URL" http://localhost:8080/launch/ >/dev/null 2>&1
fi


tail -f /dev/null

while : ; do echo "${MESSAGE=Idling...}"; sleep ${INTERVAL=600}; done