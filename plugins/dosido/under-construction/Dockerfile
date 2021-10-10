FROM node:14.17.5-alpine

RUN mkdir -p /usr/app
WORKDIR /usr/app

COPY ./package*.json /usr/app/

RUN npm install

COPY ./src /usr/app/src

CMD ["npm","run","start"]