FROM node:24.11.0-alpine3.22

ENV NODE_ENV production

WORKDIR /app
COPY . /app

RUN npm install

CMD ["node", "index.mjs"]