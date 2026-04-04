FROM ubuntu:24.04 AS base

# Set non-interactive mode to avoid prompts
ENV DEBIAN_FRONTEND=noninteractive

# Install system dependencies
RUN <<EOF
  dpkg --add-architecture i386
  apt-get update
  apt-get install -y \
    ca-certificates \
    curl \
    git \
    icnsutils \
    imagemagick \
    python3 \
    python3-pip \
    tar \
    unzip \
    wget \
    wine32:i386 \
    wine64 \
    xz-utils \
    zip
  rm -rf /var/lib/apt/lists/*
EOF

# Install Node.js LTS and pin npm
RUN <<EOF
  curl -fsSL https://deb.nodesource.com/setup_22.x | bash -
  apt-get install -y nodejs
  npm install -g npm@10.9.2
  rm -rf /var/lib/apt/lists/*
EOF

WORKDIR /app
ENV TURBO_TELEMETRY_DISABLED=1

# Install dependencies in a separate layer for better cache reuse
FROM base AS deps
COPY package.json ./
COPY Lachesis/package.json Lachesis/package-lock.json Lachesis/
COPY src/desktop/package.json src/desktop/package-lock.json src/desktop/
COPY desktop/package.json desktop/package-lock.json desktop/
RUN npm install

# Full build + package installers in one stage
FROM deps AS dist-stage
COPY . .
RUN npx turbo run dist --filter=@lachesis/desktop

# Export-only stage: artifacts land at the --output destination
FROM scratch AS export
COPY --from=dist-stage /app/desktop/dist /
