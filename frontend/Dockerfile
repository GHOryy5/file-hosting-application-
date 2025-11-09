# frontend/Dockerfile
FROM node:18-alpine
WORKDIR /app

# deps first for better caching
COPY package.json package-lock.json /app/
RUN npm ci

# then source
COPY . /app

EXPOSE 3000
ENV CI=false
CMD ["npm", "start"]
