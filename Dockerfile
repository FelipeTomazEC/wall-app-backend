FROM node:14-alpine

ENV PORT=3000

WORKDIR /usr/app

COPY package.json ./package.json

COPY yarn.lock ./yarn.lock

RUN yarn

COPY . .

RUN yarn build

RUN npx prisma generate

EXPOSE 3000

ENTRYPOINT [ "yarn", "start:migrate"]


