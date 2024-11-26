# frontend.dockerfile
FROM --platform=linux/amd64 node:lts-slim as build

# Set the working directory to /frontend within the container
WORKDIR /frontend

# Copy the frontend folder and .env file into the container
COPY ./frontend /frontend
COPY ./frontend/.env /frontend/.env

# Install dependencies, handling potential peer dependency conflicts
RUN npm install --legacy-peer-deps

# Build the Next.js application for production
RUN npm run build

# Set up a lightweight final stage for serving the application
FROM --platform=linux/amd64 node:lts-slim as production

WORKDIR /frontend
COPY --from=build /frontend /frontend

# Expose the port Next.js will run on (default is 3000)
EXPOSE 3000

# Command to run the app in production mode
CMD ["npm", "run", "start"]
