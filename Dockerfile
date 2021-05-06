FROM node:14.16.1-alpine
FROM python:3.9.4-alpine3.12
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 8080
CMD [ "node", "index.js" ]
