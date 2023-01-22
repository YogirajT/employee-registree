#build
FROM node:19.4-bullseye as build
ARG BUILD_CONTEXT

WORKDIR /app

COPY package.json .
COPY yarn.lock .

COPY ./$BUILD_CONTEXT/package.json ./$BUILD_CONTEXT/
COPY ./packages/config/package.json ./packages/config/

RUN yarn install --frozen-lockfile

COPY ./$BUILD_CONTEXT ./$BUILD_CONTEXT/
COPY ./packages/config ./packages/config/

ENV MONGO_URL mongodb://mongo1:27017?directConnection=true
RUN npm install typescript -g

RUN yarn build:config
RUN yarn build:$BUILD_CONTEXT

EXPOSE 8081

CMD node /app/backend/build/index.js