# Base image
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Pehle sirf package.json copy karein (fast caching ke liye)
COPY package*.json ./

# Dependencies install karein
RUN npm install

# Baaki sara code copy karein
COPY . .

# Vite dev server ko 0.0.0.0 par chalana zaroori hai docker ke liye
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]

