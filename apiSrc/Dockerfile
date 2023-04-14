FROM node:19.9.0-alpine3.16
ENV NODE_ENV production

EXPOSE 8090

WORKDIR /app

COPY . /app

RUN npm install

CMD ["node", "index.mjs"]
