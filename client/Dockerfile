# ----- Build Stage -----
FROM node:20-alpine AS build
WORKDIR /app

# Install deps
COPY package*.json ./
RUN npm install

# Copy source
COPY . .

# Build the production files
RUN npm run build

# ----- Production Stage -----
FROM nginx:stable-alpine
WORKDIR /usr/share/nginx/html

# Remove default nginx static content
RUN rm -rf ./*

# Copy built frontend
COPY --from=build /app/dist .

# Copy nginx config (optional)
# COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 3000

CMD ["nginx", "-g", "daemon off;"]
