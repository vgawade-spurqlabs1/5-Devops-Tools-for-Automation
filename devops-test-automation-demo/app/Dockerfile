FROM node:20-alpine

WORKDIR /app

# Install dependencies (prefer npm ci, fallback to npm install)
COPY package*.json ./
RUN npm ci --omit=dev || npm install --omit=dev

COPY src ./src

ENV NODE_ENV=production
ENV PORT=8080

EXPOSE 8080

CMD ["node", "src/server.js"]
