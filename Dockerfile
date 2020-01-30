FROM ubuntu:18.04

RUN mkdir /usr/src/app
WORKDIR /usr/src/app

COPY setup.sh setup.sh

RUN ./setup.sh

CMD ["echo", "Build Successful!"]