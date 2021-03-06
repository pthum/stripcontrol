### base image
FROM  adoptopenjdk:11-jdk-hotspot as builder
RUN apt-get update && apt-get install -y \
    git-core \
    build-essential \
    gcc \
    --no-install-recommends && \
    rm -rf /var/lib/apt/lists/*

# should have been this, but git.drogon.net was currently offline
# so i need to take an unofficial mirror 
#RUN git clone git://git.drogon.net/wiringPi

RUN git clone https://github.com/WiringPi/WiringPi.git && \
    cd WiringPi && WIRINGPI_SUDO=" " ./build

ADD ./stripcontrol/ /stripcontrol

RUN set -eux; \
    chown -R 0.0 /stripcontrol; \
    chmod 0666 /stripcontrol/*.jar; \
    chmod 0777 /stripcontrol/*.sh;

### end builder

#image itself
FROM  adoptopenjdk:11-jdk-hotspot

COPY --from=builder /usr/lib/libwiring* /usr/lib/
COPY --from=builder /stripcontrol /stripcontrol

EXPOSE 8080

ENTRYPOINT ["java","-Xmx144M", "-Xss256k","-Djava.security.egd=file:/dev/./urandom","-jar","/stripcontrol/stripcontrol.jar"]
#ENTRYPOINT ["/stripcontrol/entrypoint.sh"]

HEALTHCHECK --interval=30s --timeout=5s --retries=3 --start-period=10s \
  CMD curl --fail http://localhost:8080/api/health || exit 1