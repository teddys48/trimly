# Stage 1: Build stage using Bun
FROM oven/bun:1-alpine AS builder

WORKDIR /app

# Copy dependency specifications
COPY package.json bun.lock* ./

# Install dependencies
RUN bun install --frozen-lockfile || bun install

# Copy application source
COPY . .

# Build production bundle
RUN bun run build

# Stage 2: Serving production build with Nginx
FROM nginx:alpine AS runner

# Remove default Nginx site configuration
RUN rm /etc/nginx/conf.d/default.conf

# Copy custom Nginx config with COOP/COEP headers
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy build artifacts from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
