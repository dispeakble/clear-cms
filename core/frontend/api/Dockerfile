FROM node:14.17.5-alpine As crm-nestjs

RUN mkdir -p /usr/src/api

WORKDIR /usr/src/api

RUN npm i -g @nestjs/cli

COPY ./package.json /usr/src/api/
COPY ./yarn.lock /usr/src/api/

RUN yarn install --ignore-engines

COPY ./src /usr/src/api/src
COPY ./config /usr/src/api/config
COPY ./.eslintrc.js /usr/src/api/.eslintrc.js
COPY ./nest-cli.json /usr/src/api/nest-cli.json
COPY ./tsconfig.build.json /usr/src/api/tsconfig.build.json
COPY ./tsconfig.json /usr/src/api/tsconfig.json

RUN yarn run build

CMD ["yarn","run","start:prod"]
