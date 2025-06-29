# Use a full-featured Node image since Playwright needs system dependencies
FROM mcr.microsoft.com/playwright:v1.43.1-jammy

# Set working directory
WORKDIR /app

# Copy package files first to install deps
COPY package*.json ./

# Install dependencies (prod + dev)
RUN npm install

# Install Chromium (as required by playwright)
RUN npx playwright install chromium

# Copy the rest of the app
COPY . .

# Optional: build step if you decide to transpile later
# RUN npm run build

# Expose port (adjust if needed)
EXPOSE 3000

# Start using tsx (runs TS directly)
CMD ["npx", "tsx", "src/index.ts"]
