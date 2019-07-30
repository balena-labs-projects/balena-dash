FROM balenalib/raspberrypi3-alpine

RUN install_packages tzdata

COPY scripts /usr/src/
RUN chmod +x /usr/src/*.sh

CMD /usr/src/start.sh
