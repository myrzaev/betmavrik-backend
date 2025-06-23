FROM node:18-alpine as builder

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run test

RUN npm run build

FROM node:18-alpine

WORKDIR /app

ENV GCP_URL=https://papiconnector.all-ingame.com/api/casino
ENV API_KEY=XV20TUGHEQ3TEX5O13E1W669W
ENV API_PRIVATE=7wVpqdROodFMnp0yZxBeCNe77NBWuHRzmgvkD6VQwi4Iah4d
ENV FRONTEND_URL=http://localhost:3000
ENV REDIS_HOST=redis
ENV REDIS_PORT=6379

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./

EXPOSE 8000

CMD ["node", "dist/main"]
