#!/bin/bash

# Load NVM
source ~/.nvm/nvm.sh

# Use the Node.js version specified in .nvmrc
nvm use

# Run the development server
pnpm dev
