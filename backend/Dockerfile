# syntax=docker/dockerfile:1
FROM node:20-alpine

WORKDIR /app

# Install dependencies with BuildKit cache mount (persists between Railway builds)
COPY package.json package-lock.json ./
RUN --mount=type=cache,id=npm-cache,target=/root/.npm \
    npm install --prefer-offline

# Copy source and build
COPY . .
RUN npm run build

ENV NODE_ENV=production
ENV PATH="/app/node_modules/.bin:$PATH"

EXPOSE 9000

CMD ["medusa", "start"]
