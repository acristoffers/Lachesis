#!/usr/bin/env bash

DOCKER_BUILDKIT=1 docker build --target export --output type=local,dest=./dist .
