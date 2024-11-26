# Stage 1: Build the Next.js application
FROM --platform=linux/amd64 node:lts-slim as build

# Set the working directory
WORKDIR /frontend

# Copy package.json and package-lock.json for dependency installation
COPY ./frontend/package*.json ./

# Install dependencies, handling potential peer dependency conflicts
RUN npm install --legacy-peer-deps

# Copy the rest of the frontend code to the working directory
COPY ./frontend ./

# Add environment variables for the build phase
ARG NEXT_PUBLIC_GOOGLE_CLIENTID
ARG NEXT_PUBLIC_GOOGLE_SECRET
ENV NEXT_PUBLIC_GOOGLE_CLIENTID=$NEXT_PUBLIC_GOOGLE_CLIENTID
ENV NEXT_PUBLIC_GOOGLE_SECRET=$NEXT_PUBLIC_GOOGLE_SECRET

# Build the Next.js application for production
RUN npm run build

# Stage 2: Create a lightweight production image
FROM --platform=linux/amd64 node:lts-slim as production

# Set the working directory
WORKDIR /frontend

# Copy the built Next.js application from the build stage
COPY --from=build /frontend ./

# Set environment variables explicitly for runtime (optional)
ENV NODE_ENV=production
ENV NEXT_PUBLIC_GOOGLE_CLIENTID=$NEXT_PUBLIC_GOOGLE_CLIENTID
ENV NEXT_PUBLIC_GOOGLE_SECRET=$NEXT_PUBLIC_GOOGLE_SECRET

# Expose the port Next.js will run on
EXPOSE 3000

# Command to start the app in production mode
CMD ["npm", "run", "start"]
