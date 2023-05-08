FROM node:lts-alpine

WORKDIR /usr/src/app

COPY package.json yarn.lock ./

RUN yarn install && yarn cache clean

COPY . .

CMD ["yarn", "dev"]
