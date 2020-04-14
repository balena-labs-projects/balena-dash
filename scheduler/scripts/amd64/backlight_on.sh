#!/bin/bash

/usr/sbin/vbetool dpms on 2>/dev/null

# fallback to sysfs if vbetool fails
if [ $? -ne 0 ]; then
    # source: https://unix.stackexchange.com/a/504839
    echo -n 0 > /sys/class/backlight/*/bl_power
fi
