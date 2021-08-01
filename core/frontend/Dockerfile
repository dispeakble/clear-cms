FROM node:14.5.0-alpine As crm-nestjs

RUN mkdir -p /usr/src/api/public
RUN mkdir -p /usr/src/client/
WORKDIR /usr/src/client

COPY ./client/package*.json /usr/src/client/
RUN npm install
COPY ./client/public /usr/src/client/public
COPY ./client/src /usr/src/client/src
COPY ./client/.babelrc /usr/src/client/.babelrc
COPY ./client/jsconfig.json /usr/src/client/jsconfig.json

RUN npm run build
WORKDIR /usr/src
RUN rm -fr ./client

WORKDIR /usr/src/api

RUN npm i -g @nestjs/cli

COPY ./api/package*.json /usr/src/api/

RUN npm install

COPY ./api/src /usr/src/api/src
COPY ./api/config /usr/src/api/config
COPY ./api/.env /usr/src/api/.env
COPY ./api/nest-cli.json /usr/src/api/nest-cli.json
COPY ./api/tsconfig.build.json /usr/src/api/tsconfig.build.json
COPY ./api/tsconfig.json /usr/src/api/tsconfig.json

RUN npm run build

CMD ["rm", "-fr", "src"]
CMD ["rm", "-fr", "node_modules"]
RUN npm install --only=prod
CMD ["npm","run","start:prod"]