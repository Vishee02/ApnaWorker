# ============================================================
#  ApnaWorker — Dockerfile
#  Coolify will use this to build and run your app
# ============================================================

# Step 1: Use official Node.js 20 (stable, lightweight)
FROM node:20-alpine

# Step 2: Set working directory inside the container
WORKDIR /app

# Step 3: Copy the backend package files first (for caching)
COPY backend/package*.json ./backend/

# Step 4: Install backend dependencies
RUN cd backend && npm install --production

# Step 5: Copy ALL project files (HTML, CSS, JS, images, backend)
COPY . .

# Step 6: Expose the port your app runs on
EXPOSE 5000

# Step 7: Start the server
CMD ["node", "backend/server.js"]