#!/usr/bin/env bash
if [ $# != 1 ]; then
    echo "[VIE-ENV] Please input argument of project-name in vie-launcher"
else
    chmod -R +x ./$1/meta/*.sh
    ./$1/meta/stop.sh
fi
