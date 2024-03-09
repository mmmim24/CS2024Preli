#!/bin/bash

# Check if a ZIP file name was provided
if [ "$#" -ne 1 ]; then
    echo "Usage: $0 <zipfile.zip>"
    exit 1
fi

ZIPFILE=$1
FOLDER=$(basename "$ZIPFILE" .zip)

# Create a directory named after the ZIP file and extract the ZIP file into it
mkdir -p "$FOLDER" && unzip -d "$FOLDER" "$ZIPFILE"

# Check if the unzip was successful
if [ $? -ne 0 ]; then
    echo "Unzip failed. Exiting."
    exit 1
fi

# Change directory
cd "$FOLDER"

# Check for docker-compose.yml or Dockerfile and act accordingly
if [ -f "docker-compose.yml" ]; then
    echo "docker-compose.yml found. Using Docker Compose to build and run services..."
    docker compose up -d --build
elif [ -f "Dockerfile" ]; then
    echo "Dockerfile found. Building and running Docker container..."
    docker build --tag=sol:latest . && docker run -it -p 8000:8000 --rm --name=sol sol:latest
else
    echo "No docker-compose.yml or Dockerfile found in $FOLDER. Exiting."
    exit 1
fi
