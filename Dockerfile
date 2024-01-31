FROM node:20-alpine

RUN mkdir -p /home/node/app

WORKDIR /home/node/app

COPY package*.json ./

RUN npm install

COPY . /home/node/app

EXPOSE 8080

CMD [ "npm", "start" ]