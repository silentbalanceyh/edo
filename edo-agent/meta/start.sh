#!/usr/bin/env bash
export TCP_PORT=7000
export WEB_PORT=7100
export H2_ENV=edo-agent
export H2_DATA=data
./resources/docker/run.sh
