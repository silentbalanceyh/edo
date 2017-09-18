#!/usr/bin/env bash
export TCP_PORT=6000
export WEB_PORT=6100
export H2_ENV=edo-auth
export H2_DATA=data
./resources/docker/run.sh
