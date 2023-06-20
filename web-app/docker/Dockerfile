# STAGE 1: Build
FROM node:14.21.3-alpine3.17 AS build

ARG NPM_TOKEN
ARG BASE_HREF="/"

WORKDIR /app
COPY .npmrc.docker .npmrc
COPY package.json ./package.json
RUN npm install
RUN rm -f .npmrc

COPY . /app
RUN npm run ng -- build --configuration production --base-href $BASE_HREF

# STAGE 2: Run
FROM nginxinc/nginx-unprivileged:1.23-alpine

COPY nginx/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist/ClientApp /usr/share/nginx/html

EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]
