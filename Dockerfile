FROM node:14-alpine
WORKDIR /usr/src/survey-api
COPY ./package.json .
RUN npm install --omit=dev