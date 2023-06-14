FROM node:bookworm-slim
ENV NODE_ENV production

EXPOSE 8090

WORKDIR /app

COPY . /app

RUN npm install

CMD ["node", "index.mjs"]
