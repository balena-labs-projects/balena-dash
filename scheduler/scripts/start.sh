#!/bin/bash
(crontab -l; echo "${BACKLIGHT_ON:-0 8 * * *} /usr/src/backlight_on.sh") | crontab -
(crontab -l; echo "${BACKLIGHT_OFF:-0 23 * * *} /usr/src/backlight_off.sh") | crontab -

crond -f
