FROM node:20-alpine3.17
ENV NODE_ENV production

EXPOSE 8090

WORKDIR /app

COPY . /app

RUN npm install

CMD ["node", "index.mjs"]
