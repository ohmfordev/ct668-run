# Use the official Bun image
FROM oven/bun:1

# Set the working directory
WORKDIR /usr/src/app

# Copy only package files first for better caching of dependencies
COPY bun.lockb package.json ./

# Install dependencies
RUN bun install

# Copy the rest of the application files
COPY . .

# Build the application (ensure "build" script exists in package.json)
RUN bun build || echo "Skipping build step due to errors."

# Expose the application port (adjust based on your app, e.g., 3000 for Next.js)
EXPOSE 3000

# Use production mode and start the app
CMD ["bun", "run", "start"]
