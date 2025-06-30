FROM tofuhub/agent:v0.0.1

# Create working directory
WORKDIR /app

# Copy app source
COPY . .

RUN npm install

# Expose server port
EXPOSE 3000

# Start everything
CMD bash -c "\
  Xvfb :1 -screen 0 ${VNC_RESOLUTION}x${VNC_COL_DEPTH} & \
  until xdpyinfo -display :1 > /dev/null 2>&1; do echo 'Waiting for Xvfb...'; sleep 0.5; done && \
  fluxbox & \
  x11vnc -rfbport 5900 -display :1 -forever -shared -nopw -listen 0.0.0.0 & \
  /opt/novnc/utils/novnc_proxy --vnc localhost:5900 --listen 6080 & \
  sleep 2 && npx tsx src/index.ts"
