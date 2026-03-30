FROM node:20-alpine

# Use /server as workdir (Medusa recommendation to avoid admin conflicts)
WORKDIR /server

# Copy lockfile first for better layer caching
COPY package.json package-lock.json ./

# npm ci is faster than npm install (uses lockfile, skips resolution)
RUN npm ci

# Copy source
COPY . .

# Build-time arg for admin frontend (gets inlined into the Vite build)
ARG MEDUSA_BACKEND_URL=https://medusa-backend-production-ee25.up.railway.app
ENV MEDUSA_BACKEND_URL=$MEDUSA_BACKEND_URL

# Build Medusa (outputs to .medusa/server/)
RUN npm run build

# Switch to the build output directory
WORKDIR /server/.medusa/server

# Install production dependencies in the build output
RUN npm install

ENV NODE_ENV=production
EXPOSE 9000

# Run migrations then start the server
CMD ["sh", "-c", "node_modules/.bin/medusa db:migrate && node_modules/.bin/medusa start"]
