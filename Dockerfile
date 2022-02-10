FROM node:latest

COPY package*.json ./

COPY ./ ./

RUN npm install
RUN npm run build

CMD [ "npm", "start" ]