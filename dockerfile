FROM node:v20.18.0

# Install dependencies and Chrome
RUN apt-get update \
    && apt-get install -y wget gnupg \
    && wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - \
    && sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list' \
    && apt-get update \
    && apt-get install -y google-chrome-stable fonts-ipafont-gothic fonts-wqy-zenhei fonts-thai-tlwg fonts-kacst fonts-freefont-ttf libxss1 \
    --no-install-recommends \
    && rm -rf /var/lib/apt/lists/*

# Set environment variables
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/google-chrome-stable \
    MONGODB_URI=mongodb+srv://kuchbhi:kuchbhi@cluster0.b3rri.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0 \
    HUGGINGFACE_TOKEN=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 \
    PORT=3001

# Create working directory
WORKDIR /usr/src/app

# Copy package files and install as root
COPY package*.json ./
RUN mkdir -p /root/.config/puppeteer \
    && chmod -R 777 /root/.config \
    && npm install --legacy-peer-deps

# Copy application code
COPY . .

# Create and setup pptruser
RUN groupadd -r pptruser && useradd -r -g pptruser -G audio,video pptruser \
    && mkdir -p /home/pptruser/Downloads \
    && chown -R pptruser:pptruser /home/pptruser \
    && chown -R pptruser:pptruser /usr/src/app \
    && chown -R pptruser:pptruser /root/.config

# Switch to non-root user for runtime
USER pptruser

EXPOSE $PORT

CMD ["node", "index.js"]
