#!/bin/bash

# Check if PM2 is installed
if ! command -v pm2 &> /dev/null; then
    echo "PM2 is not installed. Installing PM2 globally..."
    npm install -g pm2
    
    # Check if installation was successful
    if ! command -v pm2 &> /dev/null; then
        echo "Failed to install PM2. Please install it manually with: npm install -g pm2"
        exit 1
    fi
    
    echo "PM2 installed successfully!"
else
    echo "PM2 is already installed."
fi

# Display PM2 version
pm2 --version
echo "You can now use PM2 to manage your indexers with: yarn pm2:start" 