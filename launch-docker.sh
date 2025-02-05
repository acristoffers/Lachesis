#!/usr/bin/env bash

docker build -t electron-builder-ubuntu .
xhost +
docker run --rm -it \
    -v "$(pwd):/app" \
    --env DISPLAY \
    --env GH_TOKEN \
    --env XDG_RUNTIME_DIR \
    --env WAYLAND_DISPLAY \
    --env PULSE_SERVER \
    --env=QT_X11_NO_MITSHM=1 \
    --volume /tmp/.X11-unix:/tmp/.X11-unix \
    --volume "${XDG_RUNTIME_DIR}:${XDG_RUNTIME_DIR}" \
    --privileged \
    electron-builder-ubuntu bash
