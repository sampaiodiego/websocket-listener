FROM node:22-alpine

COPY . .

ENV NODE_ENV=production \
    DEBUG=false

RUN npm install

CMD ["node", "index.js"]
