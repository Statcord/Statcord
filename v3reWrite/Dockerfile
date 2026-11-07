FROM node:26.12.1-alpine3.24

ENV NODE_ENV production

WORKDIR /app
COPY . /app

RUN npm install

CMD ["node", "index.mjs"]