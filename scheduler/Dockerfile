FROM balenalib/raspberrypi3-alpine

RUN install_packages tzdata

COPY scripts /usr/src/
RUN chmod +x /usr/src/*.sh

RUN apk --no-cache add raspberrypi raspberrypi-libs raspberrypi-dev alpine-sdk \
                       eudev-dev python3-dev libxrandr-dev swig \
                       p8-platform-dev cmake && \
     adduser -S builder -G abuild

USER builder

RUN cd && \
    wget https://git.alpinelinux.org/aports/plain/community/libcec/APKBUILD && \
    sed -i \
      -e '23a-DRPI_INCLUDE_DIR=/opt/vc/include \\' \
      -e '23a-DRPI_LIB_DIR=/opt/vc/lib \\' \
    APKBUILD && \
    abuild-keygen -a -i && \
    abuild

USER root

RUN apk --allow-untrusted --no-cache add \
            /home/builder/packages/home/*/libcec-4*.apk && \
    deluser --remove-home builder && \
    apk del raspberrypi-dev alpine-sdk eudev-dev python3-dev libxrandr-dev \
            swig p8-platform-dev cmake

CMD /usr/src/start.sh
