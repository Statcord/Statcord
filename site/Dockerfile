FROM node:19.6.1-alpine3.16
ENV NODE_ENV production

EXPOSE 8090

WORKDIR /app

COPY . /app

RUN apk update && \
    apk add --update git && \
    apk add --update openssh

RUN npm install

CMD ["node", "index.mjs"]