# Use a stable Node.js image
FROM node:22

# Set working directory
WORKDIR /usr/src/app

# Install app dependencies first (for better caching)
COPY package*.json ./
RUN npm install

# Copy Prisma schema
COPY prisma/ ./prisma/

# Generate Prisma client
RUN npx prisma generate

# Copy wait-for-it script
COPY wait-for-it.sh ./wait-for-it.sh
RUN chmod +x ./wait-for-it.sh

# Copy rest of the source code
COPY . .

# Expose app port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000/ || exit 1

# 🔧 FIXED: Include database seeding
CMD ["sh", "-c", "./wait-for-it.sh db:5432 -- ./wait-for-it.sh rabbitmq:5672 -- npx prisma migrate deploy && npx prisma db seed && npm start"]