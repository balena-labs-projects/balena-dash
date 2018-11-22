FROM petrosagg/resin-wpe:raspberrypi3-30c7465

COPY udev-rules/ /etc/udev/rules.d/

COPY wpe-init /wpe-init

CMD [ "/wpe-init" ]