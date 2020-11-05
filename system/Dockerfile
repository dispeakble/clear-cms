FROM node:14.5.0-alpine As crm-nestjs

RUN mkdir -p /usr/src/api/public
RUN mkdir -p /usr/src/client/
WORKDIR /usr/src/client

COPY ./client/package*.json /usr/src/client/
RUN npm install
COPY ./client /usr/src/client

RUN npm run build
WORKDIR /usr/src
RUN rm -fr ./client

WORKDIR /usr/src/api

RUN npm i -g @nestjs/cli

COPY ./api/package*.json /usr/src/api/
RUN npm install
COPY ./api /usr/src/api

RUN npm run build

CMD ["rm", "-fr", "src"]
CMD ["rm", "-fr", "node_modules"]
RUN npm install --only=prod
CMD ["npm","run","start:prod"]

#CMD ["docker", "tag", "clearcrm_crm-system", "localhost:5000/crm-system:latest", "&&", "docker", "push", "localhost:5000/crm-system:latest"]
