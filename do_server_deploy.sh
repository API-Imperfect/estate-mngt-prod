#!/bin/bash

set -e

if [ -z "$DIGITAL_OCEAN_IP_ADDRESS" ]; then
  echo "Error: DIGITAL_OCEAN_IP_ADDRESS not defined"
  exit 1
fi

cleanup_local() {
  echo "Cleaning up local temporary files..."
  rm -rf ./project.tar
}

trap cleanup_local EXIT

echo "Creating project archive..."
git archive --format tar --output ./project.tar main

echo "Uploading project... Please be patient"

rsync -avz --progress ./project.tar root@$DIGITAL_OCEAN_IP_ADDRESS:/tmp/project.tar

echo "Building and deploying on the server..."

ssh -o StrictHostKeyChecking=no root@$DIGITAL_OCEAN_IP_ADDRESS <<'ENDSSH'

set -e

cleanup_remote() {
  echo "Cleaning up remote temporary files and directories"
  rm -rf /tmp/project.tar
  rm -rf /app
}

trap cleanup_remote EXIT

TEMP_DIR=$(mktemp -d)
echo "Extracting project to $TEMP_DIR"
tar -xf /tmp/project.tar -C "$TEMP_DIR"

echo "Stopping and removing existing containers"
docker compose -f "$TEMP_DIR/production.yml" down --remove-orphans

echo "Pruning unused Docker resources..."
docker system prune -af

echo "Building and starting new containers..."
docker compose -f "$TEMP_DIR/production.yml" up --build -d --remove-orphans

ENDSSH

echo "Deployment completed successfully."
