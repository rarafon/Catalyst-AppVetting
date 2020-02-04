FROM ubuntu:18.04

WORKDIR /usr/src

RUN apt-get update
RUN apt-get upgrade -y
RUN DEBIAN_FRONTEND=noninteractive apt-get install -y gnupg curl

RUN DEBIAN_FRONTEND=noninteractive apt-get install -y \
      git vim nano\
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

RUN npm install

COPY ./controllers/createInitialUsers.js ./controllers/createInitialUsers.js
COPY ./models/userPackage.js ./models/userPackage.js
COPY ./mongoose/connection.js ./mongoose/connection.js
COPY ./script/ ./script/
COPY .env config.js ./

ARG AVT_ENVIRONMENT=${AVT_ENVIRONMENT}
ARG AVT_RESTORE_FROM_BACKUP=${AVT_RESTORE_FROM_BACKUP}
ARG AVT_RESTORE_FROM_BACKUP_BUCKET=${AVT_RESTORE_FROM_BACKUP_BUCKET}
ARG AVT_GIT_BRANCH=${AVT_GIT_BRANCH}
ARG AWS_ACCESS_KEY_ID=${AWS_ACCESS_KEY_ID}
ARG AWS_SECRET_ACCESS_KEY=${AWS_SECRET_ACCESS_KEY}
ARG AWS_S3_BUCKET=${AWS_S3_BUCKET}
ARG AWS_DEFAULT_REGION=${AWS_DEFAULT_REGION}
ARG CATALYST_USER_EMAIL=${CATALYST_USER_EMAIL}
ARG CATALYST_USER_PASSWORD=${CATALYST_USER_PASSWORD}
ARG CATALYST_USER_FIRST_N=${CATALYST_USER_FIRST_N}
ARG CATALYST_USER_LAST_N=${CATALYST_USER_LAST_N}
ARG DB_USERNAME=${DB_USERNAME}
ARG DB_PASSWORD=${DB_PASSWORD}
ARG DB_AUTHSOURCE=${DB_AUTHSOURCE}
ARG DB_HOST=${DB_HOST}
ARG DB_PORT=${DB_PORT}
ARG DB_NAME=${DB_NAME}
ARG AVT_SERVER_PORT=${AVT_SERVER_PORT}

RUN ls
RUN ./script/start-mongod.sh && ./script/createServiceUsers.sh && ./script/stop-mongod.sh

# RUN ./script/start-mongod.sh && ./script/db-restore.sh -yes ./script/stop-mongod.sh

COPY . .

EXPOSE 8000

CMD ./script/docker-start.sh