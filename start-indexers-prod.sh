#!/bin/bash

# Start all Coloniz indexers in production mode using PM2
# Usage: ./start-indexers-prod.sh [--no-build]

# Process arguments
NO_BUILD=false
if [ "$1" == "--no-build" ]; then
  NO_BUILD=true
fi

# Set up error handling
set -e

# Create a log directory if it doesn't exist
mkdir -p logs

# Make sure the indexers are built first (unless --no-build is specified)
if [ "$NO_BUILD" == "false" ]; then
  echo "Building indexers..."
  yarn build
else
  echo "Skipping build step..."
fi

# Get all indexer files
INDEXER_FILES=$(ls indexers/*.indexer.ts | xargs -n 1 basename | sed 's/\.indexer\.ts//')

# Function to check if PM2 is installed
check_pm2() {
  if ! command -v pm2 &> /dev/null; then
    echo "PM2 is not installed. Installing PM2 globally..."
    npm install -g pm2
    
    if ! command -v pm2 &> /dev/null; then
      echo "Failed to install PM2. Please install it manually with: npm install -g pm2"
      exit 1
    fi
    
    echo "PM2 installed successfully!"
  fi
}

# Check if PM2 is installed
check_pm2

# Stop any existing Coloniz indexers
echo "Stopping any existing Coloniz indexers..."
for indexer in $INDEXER_FILES; do
  pm2 delete "$indexer" 2>/dev/null || true
done

# Start each indexer with PM2
for indexer in $INDEXER_FILES; do
  echo "Starting $indexer in production mode..."
  
  pm2 start npm --name "$indexer" -- run start -- --indexer $indexer
  
  # Small delay to prevent potential race conditions
  sleep 1
done

# Clean up temporary scripts
echo "Cleaning up temporary scripts..."
# rm -f tmp_start_*.sh

# Save the PM2 process list
echo "Saving PM2 process list..."
pm2 save

echo "All indexers started in production mode with PM2"
echo "Use 'pm2 status' to check status"
echo "Use 'pm2 logs' to view logs"
echo "Use 'pm2 stop *' to stop all Coloniz indexers"
echo "Use 'pm2 delete *' to remove all Coloniz indexers from PM2"

