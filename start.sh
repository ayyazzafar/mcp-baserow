#!/bin/bash

# Baserow MCP Server Startup Script

# Set Node.js path (using nvm)
export PATH="/Users/ayyazzafar/.nvm/versions/node/v22.11.0/bin:$PATH"

# Get the directory where this script is located
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

# Change to the script directory
cd "$DIR"

# Load environment variables if .env exists
if [ -f .env ]; then
    export $(cat .env | grep -v '^#' | xargs)
fi

# Check if node_modules exists, if not install dependencies
if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    npm install
fi

# Check if dist directory exists, if not build the project
if [ ! -d "dist" ]; then
    echo "Building project..."
    npm run build
fi

# Start the MCP server
exec node dist/index.js