FROM node:20.5.0-alpine3.17 as build-stage

# setup working dir
WORKDIR /preApp
COPY . /preApp

# install git and open ssh for git deps
RUN apk update && \
    apk add --update git && \
    apk add --update openssh 

# install npm pacages
RUN npm install
RUN npm i @materializecss/materialize@2.0.2-alpha

RUN node genDocs.mjs 

# env args
ENV NODE_ENV production

# build site
RUN npm run build


FROM node:20.5.0-alpine3.17 as production-stage

RUN mkdir /app
# COPY --from=build-stage /preApp /app
COPY --from=build-stage /preApp/.output /app/.output

ENV NODE_ENV production

EXPOSE 3000

CMD ["node", "/app/.output/server/index.mjs"]