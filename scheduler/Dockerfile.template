FROM balenalib/%%BALENA_MACHINE_NAME%%-alpine

RUN install_packages tzdata

COPY scripts /usr/src/
RUN chmod +x /usr/src/*.sh

CMD ["/usr/src/start.sh"]
