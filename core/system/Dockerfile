FROM node:14.17.5-alpine As crm-nestjs

RUN apk add --no-cache git

RUN mkdir -p /usr/src/api/public
RUN mkdir -p /usr/src/client/


COPY ./client/package.json /usr/src/client/
COPY ./client/yarn.lock /usr/src/client/

COPY ./client/public /usr/src/client/public
COPY ./client/src /usr/src/client/src
COPY ./client/.babelrc /usr/src/client/.babelrc
COPY ./client/jsconfig.json /usr/src/client/jsconfig.json

WORKDIR /usr/src/client
RUN yarn install

RUN npm run build
RUN rm -fr node_modules
WORKDIR /usr/src
RUN rm -fr ./client

WORKDIR /usr/src/api

RUN npm i -g @nestjs/cli

COPY ./api/package.json /usr/src/api/
COPY ./api/yarn.lock /usr/src/api/

RUN yarn install

COPY ./api/src /usr/src/api/src
COPY ./api/config /usr/src/api/config
COPY ./api/nest-cli.json /usr/src/api/nest-cli.json
COPY ./api/tsconfig.build.json /usr/src/api/tsconfig.build.json
COPY ./api/tsconfig.json /usr/src/api/tsconfig.json

RUN npm run build

CMD ["rm", "-fr", "src"]
RUN rm -fr node_modules
RUN npm install --only=prod
CMD ["npm","run","start:prod"]