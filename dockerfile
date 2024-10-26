FROM node:20.18.0

# Install dependencies and Chrome
RUN apt-get update \
    && apt-get install -y wget gnupg \
    && wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | gpg --dearmor > /etc/apt/trusted.gpg.d/google.gpg \
    && echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" > /etc/apt/sources.list.d/google.list \
    && apt-get update \
    && apt-get install -y \
        google-chrome-stable \
        fonts-ipafont-gothic \
        fonts-wqy-zenhei \
        fonts-thai-tlwg \
        fonts-kacst \
        fonts-freefont-ttf \
        libxss1 \
        --no-install-recommends \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/* \
    && mkdir -p /tmp/chrome

# Set environment variables
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/google-chrome-stable \
    MONGODB_URI="mongodb+srv://kuchbhi:kuchbhi@cluster0.b3rri.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0" \
    HUGGINGFACE_TOKEN="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" \
    PORT=3001

# Create working directory
WORKDIR /usr/src/app

# Create a non-root user
RUN groupadd -r pptruser && useradd -r -g pptruser -G audio,video pptruser \
    && mkdir -p /home/pptruser/Downloads \
    && mkdir -p /usr/src/app/node_modules \
    && chown -R pptruser:pptruser /home/pptruser \
    && chown -R pptruser:pptruser /usr/src/app \
    && chown -R pptruser:pptruser /tmp/chrome

# Copy package files
COPY --chown=pptruser:pptruser package*.json ./

# Install dependencies
RUN npm config set cache /tmp/npm-cache --global \
    && npm install --legacy-peer-deps \
    && npm cache clean --force \
    && rm -rf /tmp/npm-cache

# Copy application code
COPY --chown=pptruser:pptruser . .

# Switch to non-root user
USER pptruser

# Chrome configuration
ENV CHROME_PATH=/usr/bin/google-chrome-stable \
    CHROME_USER_DATA_DIR=/tmp/chrome

EXPOSE $PORT

CMD ["node", "index.js"]
