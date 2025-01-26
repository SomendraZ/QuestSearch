FROM node:16-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install --production

COPY . .

EXPOSE 50051

CMD ["node", "index.js"]
