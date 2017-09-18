#!/usr/bin/env bash
if [ $# != 1 ]; then
    echo "[VIE-ENV] Please input argument of project-name in vie-launcher"
else
    chmod -R +x ./$1/target/wrapper/jsw/vigne-engine/
    mkdir -p ./$1/target/wrapper/jsw/vigne-engine/logs
    ./$1/target/wrapper/jsw/vigne-engine/bin/vigne-engine start
fi
