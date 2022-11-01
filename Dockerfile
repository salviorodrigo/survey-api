FROM node:16-alpine
WORKDIR /usr/src/survey-api
COPY ./package.json .
RUN npm install --omit=dev