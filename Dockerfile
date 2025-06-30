FROM mcr.microsoft.com/playwright:v1.43.1-jammy

# Set environment variables
ENV DISPLAY=:1 \
    VNC_RESOLUTION=1280x800 \
    VNC_COL_DEPTH=24 \
    DEBIAN_FRONTEND=noninteractive

# Install VNC server, window manager, and other tools
RUN apt-get update && apt-get install -y \
    x11vnc \
    xvfb \
    fluxbox \
    x11-utils \
    net-tools \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# Create working directory
WORKDIR /app

# Copy and install dependencies
COPY package*.json ./
RUN npm install

# Install Chromium (Playwright)
RUN npx playwright install chromium

# Copy app files
COPY . .

# Expose VNC port
EXPOSE 5900

RUN mkdir -p /root/.vnc && \
    x11vnc -storepasswd secret /root/.vnc/passwd

# Start everything up
CMD bash -c "\
  Xvfb :1 -screen 0 ${VNC_RESOLUTION}x${VNC_COL_DEPTH} & \
  until xdpyinfo -display :1 > /dev/null 2>&1; do echo 'Waiting for Xvfb...'; sleep 0.5; done && \
  fluxbox & \
  x11vnc -rfbport 5900 -display :1 -forever -shared -nopw -listen 0.0.0.0 & \
  sleep 3 && npx tsx src/index.ts"

