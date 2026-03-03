FROM mcr.microsoft.com/playwright:v1.46.0-jammy

WORKDIR /tests

COPY package*.json ./
RUN npm ci || npm install

COPY . .

ENV NODE_ENV=test

CMD ["npm", "run", "test:smoke"]
