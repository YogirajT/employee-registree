#build
FROM node:19.4-bullseye as build
ARG BUILD_CONTEXT
ARG DOCKER_BACKEND_APP_PORT
ARG DOCKER_MONGO_URL

WORKDIR /app

COPY package.json .
COPY yarn.lock .

COPY ./$BUILD_CONTEXT/package.json ./$BUILD_CONTEXT/
COPY ./packages/config/package.json ./packages/config/

RUN yarn install --frozen-lockfile

COPY ./$BUILD_CONTEXT ./$BUILD_CONTEXT/
COPY ./packages/config ./packages/config/

ENV MONGO_URL $DOCKER_MONGO_URL
RUN npm install typescript -g

RUN yarn build:config
RUN yarn build:$BUILD_CONTEXT

EXPOSE $DOCKER_BACKEND_APP_PORT

CMD node /app/backend/build/index.js