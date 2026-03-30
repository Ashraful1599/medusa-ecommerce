# syntax=docker/dockerfile:1
FROM node:20-alpine

WORKDIR /app

COPY package.json package-lock.json ./
RUN --mount=type=cache,id=npm-cache-storefront,target=/root/.npm \
    npm install --prefer-offline

COPY . .
RUN npm run build

ENV NODE_ENV=production
ENV PORT=8000
ENV HOSTNAME="0.0.0.0"

EXPOSE 8000

CMD ["npm", "run", "start"]
