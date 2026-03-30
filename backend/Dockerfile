FROM node:20-alpine

# Use /server as workdir (Medusa recommendation to avoid admin conflicts)
WORKDIR /server

# Install dependencies
COPY package.json package-lock.json ./
RUN npm install

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

# predeploy runs migrations, then start runs the server
CMD ["sh", "-c", "node_modules/.bin/medusa db:migrate && node_modules/.bin/medusa start"]
