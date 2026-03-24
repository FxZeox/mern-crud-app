# Use the official Node.js 20 image built on Alpine Linux for a small footprint
FROM node:20-alpine

# Set the internal directory where all subsequent commands will run
WORKDIR /app

# Copy package.json and package-lock.json first to leverage Docker layer caching
COPY package*.json ./

# Install the project dependencies defined in package.json
RUN npm install

# Copy the remaining application source code into the container
COPY . .

# Inform Docker that the container listens on port 5000 at runtime
EXPOSE 5000

# The command to execute when the container starts
CMD ["node", "server.js"]
