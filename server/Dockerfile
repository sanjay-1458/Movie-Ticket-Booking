FROM node:20-alpine
WORKDIR /app

# Install deps
COPY package*.json ./
RUN npm install --production

# Copy source
COPY . .

EXPOSE 5000

CMD ["node", "server.js"]
