# Stage 1: Build Vite React app
FROM node:20-alpine AS builder

WORKDIR /app

# Copy dependency definition files
COPY package*.json ./

# Install dependencies for build
RUN npm ci || npm install

# Build arguments for Vite environment variables
ARG VITE_API_URL=http://localhost:8080/api/v2
ARG VITE_SOCKET_URI=http://localhost:8080
ARG VITE_APP_NAME=TaskTracker

ENV VITE_API_URL=$VITE_API_URL
ENV VITE_SOCKET_URI=$VITE_SOCKET_URI
ENV VITE_APP_NAME=$VITE_APP_NAME

# Copy application source code
COPY . .

# Build production bundle
RUN npm run build

# Stage 2: Serve static files with Nginx
FROM nginx:alpine

# Copy custom Nginx configuration for SPA routing support
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy build artifacts from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose HTTP port
EXPOSE 80

# Run Nginx in foreground
CMD ["nginx", "-g", "daemon off;"]

