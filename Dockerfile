FROM ubuntu:18.04

WORKDIR /usr/src

COPY setup.sh setup.sh

RUN ./setup.sh

CMD ["echo", "Build Successful!"]