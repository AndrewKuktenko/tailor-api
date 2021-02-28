FROM node:12.16.1-stretch
LABEL maintainer="andriy.kuktenko@gmail.com"

ENV NAME tailor-api
ENV USER tailor

RUN apt-get update -y

RUN apt-get install -y \
	apt-transport-https \
	ca-certificates \
	curl \
  gnupg \
  bash \
  build-essential \
  python3-dev python3-pip \
  libimage-exiftool-perl \
  zip \
    --no-install-recommends

WORKDIR /usr/src/app

COPY package.json package.json
COPY entrypoint.sh entrypoint.sh
COPY nodemon.json nodemon.json
COPY tsconfig.json tsconfig.json
COPY tsconfig.build.json tsconfig.build.json
COPY webpack.config.js webpack.config.js
COPY migrate-mongo-config.js migrate-mongo-config.js
COPY config config
COPY migrations migrations
RUN npm i pm2 -g
RUN npm i migrate-mongo -g
RUN npm install
EXPOSE 3000
EXPOSE 9229
ENTRYPOINT ["./entrypoint.sh"]

