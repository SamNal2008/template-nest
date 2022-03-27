FROM node:16.14.2-alpine As development
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
RUN npm i -g @nestjs/cli
COPY . .
RUN npm run build

FROM node:16.14.2-alpine As production
ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install --only=production
RUN npm i -g @nestjs/cli
COPY . .
COPY --from=development /usr/src/app/dist ./dist
CMD ["node", "dist/main"]