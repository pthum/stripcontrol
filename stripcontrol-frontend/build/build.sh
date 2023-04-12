#!/bin/bash

[ -z "$1" ] && echo "service name not given, exiting" && exit 1

SFX=$RANDOM
TEST_IMG_NAME="test-${1}:${SFX}"
TEST_CONTAINER_NAME="test_${1}_${SFX}"

clean_up() {
  docker stop -t 20 "$TEST_CONTAINER_NAME" || true 
  docker rm -v -f "$TEST_CONTAINER_NAME" || true
  docker rmi -f "$TEST_IMG_NAME" || true
}

export_file() {
  docker cp "$TEST_CONTAINER_NAME:/$1" "$2"
}
export_build_result() {
  export_file "/app/dist" "../"
  
}

build_container() {
  docker build --no-cache --rm \
    -f package/build.Dockerfile \
    -t "$TEST_IMG_NAME" ../ || clean_up
}

run_container() {
  docker run --name "$TEST_CONTAINER_NAME" "$TEST_IMG_NAME"
}
rm -rf ../dist
build_container 
run_container || clean_up
export_build_result || clean_up
clean_up
