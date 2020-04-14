#!/bin/bash
pkill xinit

sleep 3

# delete the last line in xstart script and replace with new settings
sed -i '$d' /home/chromium/xstart.sh
echo "Input = $1"

if [[ -z ${CONFIG_MODE+x} ]]
  then
    echo "Enabling config mode"
    export URL="--app=$1"
  else
    echo "Disabling config mode"
    export URL=$1
fi

echo "chromium-browser $URL $FLAGS --window-size=$WINDOW_SIZE" >> /home/chromium/xstart.sh

# make sure any lock on the Chromium profile is released
chown -R chromium:chromium /usr/src/app/settings
rm -f /usr/src/app/settings/SingletonLock

#Set whether to show a cursor or not
if [[ -z ${SHOW_CURSOR+x} ]]
  then
    export CURSOR='-- -nocursor'
    echo "Disabling cursor"
  else
    export CURSOR=''
    echo "Enabling cursor"
fi

# run script as chromium user
su -c "export DISPLAY=:0 && startx /home/chromium/xstart.sh $CURSOR" - chromium
