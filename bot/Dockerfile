FROM node:24.13.0-alpine3.23

ENV NODE_ENV production

WORKDIR /app

RUN apk update && \
    apk add --update git && \
    apk add --update openssh 

COPY . /app

RUN npm install

CMD ["node", "index.mjs"]