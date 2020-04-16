#!/bin/bash
pkill xinit

sleep 3

# delete the last line in xstart script and replace with new settings
sed -i '$d' /home/chromium/xstart.sh

#Set whether to show a cursor or not
if [[ ! -z $SHOW_CURSOR ]] && [[ "$SHOW_CURSOR" -eq "1" ]]
  then
    export CURSOR=''
    echo "Enabling cursor"
  else
    export CURSOR='-- -nocursor'
    echo "Disabling cursor"
    
fi

if [ ! -z ${CONFIG_MODE+x} ] && [ "$CONFIG_MODE" -eq "1" ]
  then
    echo "Enabling config mode"
    export URL=$1
    export CURSOR=''
    echo "Enabling cursor"
  else
    echo "Disabling config mode"
    export URL="--app=$1"
fi

echo "chromium-browser $URL $FLAGS --window-size=$WINDOW_SIZE" >> /home/chromium/xstart.sh

# make sure any lock on the Chromium profile is released
chown -R chromium:chromium /usr/src/app/settings
rm -f /usr/src/app/settings/SingletonLock



# run script as chromium user
su -c "export DISPLAY=:0 && startx /home/chromium/xstart.sh $CURSOR" - chromium
