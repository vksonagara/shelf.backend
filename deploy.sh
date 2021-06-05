#!/usr/bin/env bash

./build.sh

docker rm -f shelf.backend

bash ~/containers/shelf_backend.sh