# Stage 1: Build the React/Vite app
FROM node:20-alpine AS build

WORKDIR /app

# Copy dependency files
COPY package.json package-lock.json ./

# Install dependencies
RUN npm ci

# Copy the rest of the application files
COPY . .

# Build the application
RUN npm run build

# Stage 2: Serve the application
FROM node:20-alpine AS runner

WORKDIR /app

# Copy production configurations and server code
COPY package.json package-lock.json ./
COPY server.js ./

# Install production dependencies only (express is a production dependency)
RUN npm ci --only=production

# Copy built static files from build stage
COPY --from=build /app/dist ./dist

# Set port environment variable (default for Cloud Run is 8080)
ENV PORT=8080
EXPOSE 8080

# Start the server
CMD ["node", "server.js"]
