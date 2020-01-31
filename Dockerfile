FROM ubuntu:18.04

ENV AVT_ENVIRONMENT='development'
ENV AWS_ACCESS_KEY_ID=''
ENV AWS_SECRET_ACCESS_KEY=''
ENV AWS_SESSION_TOKEN=''
ENV AWS_REGION='us-west-2'
ENV CATALYST_USER_EMAIL='test@user.com'
ENV CATALYST_USER_PASSWORD='password123'
ENV CATALYST_USER_FIRST_N='John'
ENV CATALYST_USER_LAST_N='Doe'
ENV DB_USERNAME='adminDBusername'
ENV DB_PASSWORD='adminDBpassword'

WORKDIR /usr/src

RUN apt-get update
RUN apt-get upgrade -y
RUN DEBIAN_FRONTEND=noninteractive apt-get install -y gnupg curl

RUN DEBIAN_FRONTEND=noninteractive apt-get install -y \
      git \
      awscli 

RUN curl -sL https://deb.nodesource.com/setup_12.x | bash - && \
    apt-get install -y nodejs

RUN apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv 9DA31620334BD75D9DCB49F368818C72E52529D4
RUN echo "deb [ arch=amd64 ] https://repo.mongodb.org/apt/ubuntu bionic/mongodb-org/4.0 multiverse" | tee /etc/apt/sources.list.d/mongodb-org-4.0.list
RUN apt-get update && DEBIAN_FRONTEND=noninteractive apt-get install -y mongodb-org

RUN mkdir Catalyst-AppVetting && \
    mkdir db && mkdir db_backups && \
    mkdir logs

WORKDIR /usr/src/Catalyst-AppVetting

COPY package.json package.json
COPY package-lock.json package-lock.json

RUN npm install -g

COPY . .

RUN ./createServiceUsers.sh

EXPOSE 8000
CMD ./restart.sh