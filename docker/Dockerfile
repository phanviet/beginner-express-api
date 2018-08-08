FROM node:8.11-alpine

RUN apk update \
  && apk add \
    build-base \
    python \
    python-dev

ENV APP_PATH /usr/src/app
WORKDIR $APP_PATH

COPY package*.json $APP_PATH/
RUN npm install

COPY . .

EXPOSE 3000
CMD ['./docker/Dockerexec.sh']
