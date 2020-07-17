FROM node:12.13-alpine As crm-nestjs

RUN ["npm", "i", "-g", "@nestjs/cli"]

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY ./api/package*.json /usr/src/app/
RUN npm install
COPY ./api /usr/src/app

RUN npm run build

CMD ["npm", "run", "start:prod"]