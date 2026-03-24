# Use a lightweight Node.js image. Smaller image means faster pulls and less storage.
FROM node:20-alpine

# Set the working directory inside the container.
WORKDIR /app

# Copy dependency files first for better Docker layer caching.
COPY package*.json ./

# Install dependencies. Using 'npm install' or 'npm ci' for reproducible builds.
RUN npm install

# Copy the rest of your frontend code into the container.
COPY . .

# Set the host to 0.0.0.0 so the server is accessible outside the container.
ENV HOST=0.0.0.0

# Document that the app runs on port 3000.
EXPOSE 3000

# Start the React development server.
CMD ["npm", "start"]
