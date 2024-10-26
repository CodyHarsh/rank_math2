FROM node:18.13.0

# Install necessary dependencies and Chrome
RUN apt-get update && \
    apt-get install -y \
    python \
    make \
    gcc \
    g++ \
    gnupg \
    wget

# Install Google Chrome
RUN wget --quiet --output-document=- https://dl-ssl.google.com/linux/linux_signing_key.pub | gpg --dearmor > /etc/apt/trusted.gpg.d/google-archive.gpg && \
    sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list' && \
    apt-get update && \
    apt-get install google-chrome-stable -y --no-install-recommends && \
    rm -rf /var/lib/apt/lists/*

# Set environment variables
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/google-chrome-stable \
    MONGODB_URI=mongodb+srv://kuchbhi:kuchbhi@cluster0.b3rri.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0 \
    HUGGINGFACE_TOKEN=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 \
    PORT=3001

# Create app user and group
RUN groupadd -r app && useradd -rm -g app -G audio,video app

# Set working directory
WORKDIR /home/app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install --legacy-peer-deps --no-cache

# Copy the rest of the application code
COPY . .

# Set permissions
RUN chown -R app:app /home/app
RUN chmod -R 777 /home/app

# Switch to app user
USER app

# Expose port
EXPOSE $PORT

# Start the application
CMD ["node", "index.js"]
