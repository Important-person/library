FROM node:23.11.0-slim

WORKDIR /express

ARG NODE_ENV=production

COPY package*.json ./
COPY tsconfig.json ./
COPY nodemon.json .

RUN npm install --include=dev

COPY ./src /express/src

RUN npm run build

CMD [ "npm", "run", "dev" ]