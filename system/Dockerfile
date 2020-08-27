FROM node:14.5.0-alpine As crm-nestjs

RUN ["npm", "i", "-g", "@nestjs/cli"]

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app


#COPY ./api/package*.json /usr/src/app/ //TODO copy from ./client, build, copy dist to /api/public, build app
#RUN npm install
#COPY ./api /usr/src/app
#
#RUN npm run build

COPY ./api/package*.json /usr/src/app/
RUN npm install
COPY ./api /usr/src/app

RUN npm run build


CMD ["rm", "-fr", "src"]
CMD ["npm","run","start:prod"]

#CMD ["docker", "tag", "clearcrm_crm-system", "localhost:5000/crm-system:latest", "&&", "docker", "push", "localhost:5000/crm-system:latest"]
