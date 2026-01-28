FROM node:25-alpine3.22

ENV NODE_ENV production

WORKDIR /app

RUN apk update && \
    apk add --update git && \
    apk add --update openssh 

COPY . /app

RUN npm install

CMD ["node", "index.mjs"]