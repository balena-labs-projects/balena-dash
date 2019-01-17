#!/bin/bash
(crontab -l; echo "$BACKLIGHT_ON /usr/src/backlight_on.sh") | crontab -
(crontab -l; echo "$BACKLIGHT_OFF /usr/src/backlight_off.sh") | crontab -

crond -f
