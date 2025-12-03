FROM node:22-alpine

WORKDIR /app

# Docker layer caching
COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000

CMD ["npm", "run", "prod"]
