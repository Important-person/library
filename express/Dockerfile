FROM node:23.11.0-slim

WORKDIR /express

ARG NODE_ENV=production

COPY package*.json ./
COPY tsconfig.json ./

RUN npm install --include=dev

RUN npm install -g typescript

COPY ./src /express/src

RUN npm run build

CMD [ "npm", "run", "server" ]