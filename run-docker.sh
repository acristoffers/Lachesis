#!/usr/bin/env bash
# Runs the Lachesis AppImage inside Docker, forwarding the host display.
# Useful on NixOS where AppImages cannot run directly.
set -euo pipefail

APPIMAGE=$(ls "$(dirname "$0")/dist"/Lachesis-*.AppImage 2>/dev/null | head -1)
if [[ -z "$APPIMAGE" ]]; then
  echo "No AppImage found in ./dist/. Run bash launch-docker.sh first." >&2
  exit 1
fi
APPIMAGE=$(realpath "$APPIMAGE")

# Common docker flags
DOCKER_ARGS=(
  --rm
  -v "$APPIMAGE:/app/Lachesis.AppImage:ro"
  --device /dev/dri           # GPU / DRI access for rendering
)

if [[ -n "${WAYLAND_DISPLAY:-}" && -n "${XDG_RUNTIME_DIR:-}" ]]; then
  DOCKER_ARGS+=(
    -e WAYLAND_DISPLAY="$WAYLAND_DISPLAY"
    -e XDG_RUNTIME_DIR=/run/user/host
    -v "$XDG_RUNTIME_DIR/$WAYLAND_DISPLAY:/run/user/host/$WAYLAND_DISPLAY"
  )
elif [[ -n "${DISPLAY:-}" ]]; then
  xhost +local:docker 2>/dev/null || true
  DOCKER_ARGS+=(
    -e DISPLAY="$DISPLAY"
    -v /tmp/.X11-unix:/tmp/.X11-unix
  )
else
  echo "No display server detected (DISPLAY or WAYLAND_DISPLAY not set)." >&2
  exit 1
fi

# --appimage-extract-and-run avoids FUSE (not available in most containers)
# --no-sandbox is required when running Electron as root or without a user
# namespace (common inside Docker)
exec docker run "${DOCKER_ARGS[@]}" ubuntu:24.04 \
  /app/Lachesis.AppImage --appimage-extract-and-run --no-sandbox "$@"
