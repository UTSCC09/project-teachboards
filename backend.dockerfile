# Base image for the backend server
FROM --platform=linux/amd64 node:lts-slim

# Set the working directory in the container
WORKDIR /backend/socket-server

# Copy package.json and package-lock.json from the backend/socket-server directory
COPY ./backend/socket-server/package*.json ./

# Install dependencies
RUN npm ci

# Copy the rest of the backend code from backend/socket-server into the container
COPY ./backend/socket-server /backend/socket-server

# Expose the port the backend WebSocket server will run on
EXPOSE 4000

# Command to start the WebSocket server
CMD ["node", "index.js"]
