#!/usr/bin/env bash
if [ $# != 1 ]; then
    echo "[VIE-ENV] Please input argument of project-name in vie-launcher"
else
    chmod -R +x ./$1/target/wrapper/jsw/vigne-kdeploy/
    mkdir -p ./$1/target/wrapper/jsw/vigne-kdeploy/logs

    ./$1/target/wrapper/jsw/vigne-kdeploy/bin/vigne-kdeploy console
fi
