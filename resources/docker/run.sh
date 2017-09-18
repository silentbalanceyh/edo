#!/usr/bin/env bash
docker run -v $PWD/$H2_DATA:/opt/data -d -p $TCP_PORT:1521 -p $WEB_PORT:81 --name=$H2_ENV oscarfonts/h2
#docker logs -f $H2_ENV 2> $H2_LOG
#xdg-open http://localhost:$WEB_PORT/
