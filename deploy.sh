#!/bin/bash

# Update package.json
sed -i 's/"next": ".*"/"next": "^14.0.0"/' package.json
sed -i 's/"react": ".*"/"react": "^18.2.0"/' package.json
sed -i 's/"react-dom": ".*"/"react-dom": "^18.2.0"/' package.json
sed -i 's/"eslint-config-next": ".*"/"eslint-config-next": "^14.0.0"/' package.json
sed -i 's/"dev": "next dev --turbopack"/"dev": "next dev"/' package.json

# Check if .env file exists, if not, copy from .env.example
if [ ! -f .env ]; then
    cp .env.example .env
    echo "Created .env file. Please update it with your actual values."
fi

# Clean npm cache and reinstall dependencies
npm cache clean --force
rm -rf node_modules package-lock.json
npm install

# Build the project
npm run build

echo "Deployment preparation complete. Please review the .env file and update any necessary values."
echo "To start the production server, run: npm start"