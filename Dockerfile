# ReqRes API Automation — Docker image
#
# Based on the official Playwright image so Chromium (and friends) and the
# required OS libraries are already present. Keep PLAYWRIGHT_VERSION in sync
# with the @playwright/test version pinned in package-lock.json.

ARG PLAYWRIGHT_VERSION=1.63.0
FROM mcr.microsoft.com/playwright:v${PLAYWRIGHT_VERSION}-noble

WORKDIR /app

# Install dependencies first to leverage Docker layer caching
COPY package.json package-lock.json ./
RUN npm ci

# Copy the rest of the project
COPY . .

# Make sure the installed browsers match the resolved @playwright/test version
RUN npx playwright install --with-deps chromium

# Default command: run the full test suite
CMD ["npm", "test"]