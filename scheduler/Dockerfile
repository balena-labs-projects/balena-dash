FROM balenalib/raspberrypi3-alpine

COPY scripts /usr/src/
RUN chmod +x /usr/src/*.sh

# RUN (crontab -l; echo "0 8 * * * /usr/src/backlight_on.sh") | crontab -
# RUN (crontab -l; echo "19 11 * * * /usr/src/backlight_off.sh") | crontab -

CMD crond -f
