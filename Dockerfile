FROM node:22-alpine

COPY . .

ENV NODE_ENV=production \
    DEBUG=false \
    MODE=client

RUN npm install

ENTRYPOINT ["./run.sh"]
