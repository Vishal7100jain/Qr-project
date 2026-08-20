# ==== Base Image for Building ====
FROM node:22-alpine AS builder

# Create app directory
WORKDIR /app

# Install dependencies first (better caching)
COPY package*.json ./
COPY package-lock.json ./

RUN npm install

# Copy full project
COPY . .

# Build Backend project
RUN npm run build


# ==== Production Image ====
FROM node:22-alpine AS runner

WORKDIR /app

# Set NODE_ENV to production
ENV NODE_ENV=production

# Copy only necessary files from builder
COPY --from=builder /app/public ./public
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./

# Install only production dependencies
RUN npm install --omit=dev

# Expose Backend port
EXPOSE 3001

# Default Command
CMD ["npm", "start"]
