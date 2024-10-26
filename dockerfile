# Use the Puppeteer image as the base
FROM ghcr.io/puppeteer/puppeteer:23.6.0

# Set environment variables
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/google-chrome-stable \
    MONGODB_URI=mongodb+srv://kuchbhi:kuchbhi@cluster0.b3rri.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0 \
    HUGGINGFACE_TOKEN=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 \
    PORT=3001

# Set the working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code to the container
COPY . .

# Expose the specified port
EXPOSE $PORT

# Command to run the application
CMD [ "node", "index.js" ]
