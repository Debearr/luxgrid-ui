FROM node:20-alpine AS base

ENV NODE_ENV=production \
    PUPPETEER_SKIP_DOWNLOAD=true

WORKDIR /app

# Install production deps only
COPY package.json ./
RUN npm install --omit=dev

# Copy runtime scripts
COPY scripts ./scripts

# Default command (overridden by Compose/K8s)
CMD ["node", "-e", "console.log('Image ready')"]

