FROM node:22.4.1-bookworm-slim

ENV NODE_ENV production

WORKDIR /app

RUN apt -y update && \
    apt -y install git

COPY . /app

RUN npm install

CMD ["node", "index.mjs"]