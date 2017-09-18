#!/usr/bin/env bash
export TCP_PORT=6002
export WEB_PORT=6102
export H2_ENV=edo-addr
export H2_DATA=data
./resources/docker/run.sh
