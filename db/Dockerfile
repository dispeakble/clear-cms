FROM node:14.5.0-alpine As crm-nestjs

RUN ["npm", "i", "-g", "@nestjs/cli"]

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY ./api/package*.json /usr/src/app/
RUN npm install
COPY ./api /usr/src/app

RUN npm run build

CMD ["docker", "tag", "crm_crm-db", "localhost:5000/crm-db", "&&", "docker", "push", "localhost:5000/crm-db"]

CMD ["npm", "run", "start:prod"]