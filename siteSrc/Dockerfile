FROM node:20.5.0-alpine3.17 as build-stage

# env args
ARG discordBotID
ENV discordBotID $discordBotID
ARG domain
ENV domain $domain

# setup working dir
WORKDIR /preApp
COPY . /preApp

RUN apk update && \
    apk add --update git && \
    apk add --update openssh 
    # && \
#     apk add --update curl

# install npm pacages
RUN npm install

# generate docs
# RUN ./genDocs.sh

# build site
RUN npm run build


FROM node:20.5.0-alpine3.17 as production-stage
RUN mkdir /app
COPY --from=build-stage /preApp /app

EXPOSE 3000

CMD ["node", "/app/.output/server/index.mjs"]