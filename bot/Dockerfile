FROM node:26.12.1-alpine3.24

ENV NODE_ENV production

WORKDIR /app

RUN apk update && \
    apk add --update git && \
    apk add --update openssh 

# for node-gyp
RUN apk add --no-cache \
    python3 \
    make \
    g++ \
    cairo-dev \
    pango-dev \
    jpeg-dev \
    giflib-dev \
    pixman-dev

COPY . /app

RUN npm install

CMD ["node", "index.mjs"]