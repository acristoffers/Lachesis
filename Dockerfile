FROM ubuntu:24.04

# Set non-interactive mode to avoid prompts
ENV DEBIAN_FRONTEND=noninteractive

# Install necessary dependencies
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

# Install Node.js (LTS) and npm
RUN <<EOF
  curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
  apt-get install -y nodejs
EOF

# Set up a working directory
WORKDIR /app

# Default command
CMD [ "bash" ]
