FROM node:14.17.5-alpine As crm-nestjs

RUN mkdir -p /usr/src/
WORKDIR /usr/src

COPY ./ /usr/src/
RUN npm install

RUN npm run build_prod

CMD ["npm","run","start"]