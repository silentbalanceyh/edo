#!/usr/bin/env bash
export TCP_PORT=6003
export WEB_PORT=6103
export H2_ENV=edo-hr
export H2_DATA=data
./resources/docker/run.sh
