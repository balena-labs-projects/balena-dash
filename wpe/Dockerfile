FROM petrosagg/resin-wpe:raspberrypi3-30c7465

COPY udev-rules/ /etc/udev/rules.d/

COPY wpe-init /wpe-init

RUN chmod +x wpe-init

CMD [ "/wpe-init" ]

ENV TOHORA_VERSION=0.3.0
RUN wget -O tohora.tgz \
    "https://github.com/mozz100/tohora/releases/download/v0.3.0/tohora_"$TOHORA_VERSION"_Linux_armv5.tar.gz" \
    && tar xzf tohora.tgz \
    && rm tohora.tgz
