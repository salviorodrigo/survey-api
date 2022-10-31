FROM node:16-alpine
WORKDIR /usr/src/survey-api
COPY ./package.json .
RUN npm install --omit=dev
COPY ./dist ./dist
EXPOSE 5000
CMD npm start