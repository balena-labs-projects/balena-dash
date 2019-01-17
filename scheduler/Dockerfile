FROM balenalib/raspberrypi3-alpine-python

ENV INITSYSTEM on

COPY scripts /usr/src/
RUN chmod +x /usr/src/*.sh

# RUN (crontab -l; echo "0 8 * * * /usr/src/backlight_on.sh") | crontab -
# RUN (crontab -l; echo "19 11 * * * /usr/src/backlight_off.sh") | crontab -

ENTRYPOINT crond -f
