FROM node:14.17.5-alpine As crm-nestjs

RUN npm i -g @nestjs/cli

RUN mkdir -p /usr/src/api
WORKDIR /usr/src/api

COPY ./api/package.json /usr/src/api/
COPY ./api/yarn.lock /usr/src/api/

RUN yarn install

COPY ./api/src /usr/src/api/src
COPY ./api/nest-cli.json /usr/src/api/nest-cli.json
COPY ./api/tsconfig.build.json /usr/src/api/tsconfig.build.json
COPY ./api/tsconfig.json /usr/src/api/tsconfig.json

RUN yarn run build

RUN rm -fr src
CMD ["yarn","run","start:prod"]