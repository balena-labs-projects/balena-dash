#! /bin/bash

if [ ! -z ${CONTROL_TV+x} ] && [ "$CONTROL_TV" -eq "1" ]
  then
    #Set the TV input to the Pi
    echo 'as' | cec-client -s -d 1
fi

cd /home/chromium/tohora && ./tohora 8080 /home/chromium/launch.sh &

wget --post-data "url=$LAUNCH_URL" http://localhost:8080/launch/ >/dev/null 2>&1 && sleep infinity


