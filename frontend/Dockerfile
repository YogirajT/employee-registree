#build
FROM node:19.4-bullseye as build
ARG BUILD_CONTEXT
ARG DOCKER_FRONTEND_HOST_PORT

WORKDIR /app

COPY package.json .
COPY yarn.lock .

COPY ./$BUILD_CONTEXT/package.json ./$BUILD_CONTEXT/
COPY ./packages/config/package.json ./packages/config/

RUN yarn install --frozen-lockfile --production

COPY ./$BUILD_CONTEXT ./$BUILD_CONTEXT/
COPY ./packages/config ./packages/config/
RUN npm install typescript -g

RUN yarn build:config
RUN yarn build:$BUILD_CONTEXT

#webserver
FROM nginx:stable-alpine
ARG BUILD_CONTEXT
COPY --from=build /app/$BUILD_CONTEXT/build /usr/share/nginx/html
COPY ./$BUILD_CONTEXT/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE ${DOCKER_FRONTEND_HOST_PORT}
CMD ["nginx", "-g", "daemon off;"]



