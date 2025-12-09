FROM node:18-alpine

WORKDIR /usr/src/app

# ติดตั้ง Dependencies
COPY package.json package-lock.json ./
RUN npm install
RUN apk update && apk add --no-cache curl

# ก๊อปปี้โค้ดทั้งหมด
COPY . .

EXPOSE 4000
CMD [ "node", "server.js" ]