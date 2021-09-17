# STAGE 1
FROM node:16-alpine as builder

RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app

WORKDIR /home/node/app

COPY package*.json ./

USER node

RUN npm install

COPY --chown=node:node . .

RUN npm run build

# STAGE 2
FROM node:16-alpine

RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app

RUN npm install -g pm2

WORKDIR /home/node/app

COPY package*.json ./

USER node

RUN npm install --only=production

COPY --from=builder /home/node/app/build ./build

EXPOSE 8000

CMD ["pm2-runtime", "build/server.js"]
