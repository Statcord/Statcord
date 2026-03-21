FROM node:25-alpine3.22 as build-stage

# setup working dir
WORKDIR /preApp
COPY . /preApp

# install git and open ssh for git deps
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

# install npm pacages
RUN npm install

# env args
ENV NODE_ENV production

# build site
RUN npm run build


FROM node:25-alpine3.22 as production-stage

RUN mkdir /app
COPY --from=build-stage /preApp/.output /app/.output

ENV NODE_ENV production

EXPOSE 3000

CMD ["node", "/app/.output/server/index.mjs"]