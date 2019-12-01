#!/bin/bash
if [ ! -z ${ENABLE_BACKLIGHT_TIMER+x} ] && [ "$ENABLE_BACKLIGHT_TIMER" -eq "1" ]
then
  (crontab -l; echo "${BACKLIGHT_ON:-8 * * * *} /usr/src/backlight_on_vbetool.sh") | crontab -
  (crontab -l; echo "${BACKLIGHT_OFF:- 23 * * * *} /usr/src/backlight_off_vbetool.sh") | crontab -
fi

cron -f

while : ; do echo "${MESSAGE=Idling...}"; sleep ${INTERVAL=600}; done
