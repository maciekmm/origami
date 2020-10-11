#!/usr/bin/env bash

community_container=$(docker ps --filter "label=com.docker.compose.service=community" --format '{{ .ID }}')

if [ -z "$community_container" ]; then
    echo "Project not running, start? [y/N]"
    read -r intent_response

    if [ "$intent_response" = "y" ]; then
        if ! docker-compose -f docker-compose.yml -f docker-compose.dev.yml up -d; then
            exit 1
        fi
        community_container=$(docker ps --filter "label=com.docker.compose.service=community" --format '{{ .ID }}')
    else
        exit 1
    fi
fi

manage_arg=$@

docker exec -it ${community_container} python manage.py ${manage_arg}