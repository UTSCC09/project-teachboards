# Base image for the backend server
FROM --platform=linux/amd64 node:lts-slim

# Set the working directory in the container
WORKDIR /socket-server

# Copy the backend code into the container
COPY ./socket-server /socket-server

# Install dependencies
RUN npm install

# Expose the port the backend WebSocket server will run on (default is 4000)
EXPOSE 4000

# Command to start the WebSocket server
CMD ["node", "index.js"]
