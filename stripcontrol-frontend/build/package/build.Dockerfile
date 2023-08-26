# build stage
FROM node:18-alpine as build-stage
WORKDIR /app

RUN apk add --no-cache python3 make g++ 

COPY . .
RUN yarn install && yarn cache clean && yarn build
