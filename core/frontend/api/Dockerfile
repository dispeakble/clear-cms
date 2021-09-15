FROM node:14.5.0-alpine As crm-nestjs

RUN mkdir -p /usr/src/api

WORKDIR /usr/src/api

RUN npm i -g @nestjs/cli

COPY ./package*.json /usr/src/api/

RUN npm install

COPY ./src /usr/src/api/src
COPY ./config /usr/src/api/config
COPY ./nest-cli.json /usr/src/api/nest-cli.json
COPY ./tsconfig.build.json /usr/src/api/tsconfig.build.json
COPY ./tsconfig.json /usr/src/api/tsconfig.json

RUN npm run build

CMD ["rm", "-fr", "src"]
CMD ["rm", "-fr", "node_modules"]
RUN npm install --only=prod
CMD ["npm","run","start:prod"]
