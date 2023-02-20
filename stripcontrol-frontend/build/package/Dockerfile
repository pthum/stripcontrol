# build stage
FROM node:16-alpine as build-stage
WORKDIR /app
COPY package*.json ./
COPY yarn.lock ./
RUN apk add --no-cache python3 make g++ \
  && yarn install
COPY . .
RUN yarn build

# final image
FROM nginx:stable-alpine 
COPY --from=build-stage /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
