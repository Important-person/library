FROM node:20.11.1

WORKDIR /counter_express

ARG NODE_ENV=production

COPY package*.json ./

RUN npm install

COPY ./src /counter_express/src

CMD [ "npm", "run", "server" ]

