# Use Node.js 20 Alpine as base image
FROM node:20-alpine AS base

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./
COPY tsconfig*.json ./
COPY nx.json ./

# Install dependencies
RUN npm ci --only=production

# Development stage
FROM base AS development
RUN npm ci
COPY . .
WORKDIR /app/apps/vn-record-store-be
RUN npx prisma generate
WORKDIR /app
RUN npx nx build vn-record-store-be --prod

# Production stage
FROM node:20-alpine AS production

# Install dumb-init for proper signal handling
RUN apk add --no-cache dumb-init

# Create app user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nestjs -u 1001

# Set working directory
WORKDIR /app

# Copy package files and install production dependencies + ts-node for seeding
COPY package*.json ./
RUN npm ci --only=production && npm install ts-node typescript && npm cache clean --force

# Copy built application
COPY --from=development --chown=nestjs:nodejs /app/apps/vn-record-store-be/dist ./dist
COPY --from=development --chown=nestjs:nodejs /app/apps/vn-record-store-be/prisma ./prisma
COPY --from=development --chown=nestjs:nodejs /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=development --chown=nestjs:nodejs /app/node_modules/@prisma ./node_modules/@prisma

# Switch to non-root user for security
# USER nestjs

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node healthcheck.js

# Start the application
ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "dist/main.js"] 