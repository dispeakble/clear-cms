FROM crm_crm-reactjs:latest as system_react

WORKDIR /usr/src/app

COPY ./client .

RUN npm install --only-production

RUN npm run react:build

FROM crm_crm-nestjs:latest

WORKDIR /usr/src/app

COPY ./api .

RUN npm install --only=production

COPY --from=system_react /usr/src/app/dist ./client

RUN npm run build

CMD ["npm", "run", "start:prod"]