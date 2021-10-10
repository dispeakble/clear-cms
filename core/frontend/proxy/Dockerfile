FROM node:14.17.5-alpine As crm-nestjs

RUN ["npm", "i", "-g", "@nestjs/cli"]

RUN mkdir -p /usr/src/api
WORKDIR /usr/src/api

COPY ./package*.json /usr/src/api/
COPY ./yarn.lock /usr/src/api/yarn.lock

RUN npm install

COPY ./src /usr/src/api/src
COPY ./config /usr/src/api/config
COPY ./nest-cli.json /usr/src/api/nest-cli.json
COPY ./tsconfig.build.json /usr/src/api/tsconfig.build.json
COPY ./tsconfig.json /usr/src/api/tsconfig.json

RUN npm run build

CMD ["rm", "-fr", "src"]
CMD ["npm","run","start:prod"]

#CMD ["docker", "tag", "clearcrm_crm-proxy", "localhost:5000/crm-proxy:latest", "&&", "docker", "push", "localhost:5000/crm-proxy:latest"]

