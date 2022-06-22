FROM node:16.14.2-alpine as build
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:16.14.2-alpine as production
WORKDIR /usr/src/app
COPY --from=build /usr/src/app/dist ./dist
RUN chown node:node -R /usr/src/app/dist
USER node
CMD ["node", "dist/main"]
