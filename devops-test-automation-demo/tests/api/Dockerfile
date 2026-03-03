FROM node:20-alpine

WORKDIR /tests

COPY package*.json ./
RUN npm ci || npm install

COPY . .

ENV NODE_ENV=test

CMD ["npm", "test"]
