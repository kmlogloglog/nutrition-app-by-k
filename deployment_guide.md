# Deployment Guide for Nutrition-Fitness App

## Prerequisites
- Node.js (v14 or later)
- npm (v6 or later)
- Git

## Steps to Deploy

1. Clone the repository (if not already done):
   ```
   git clone https://github.com/kmlogloglog/nutrition-fitness-app.git
   cd nutrition-fitness-app
   ```

2. Update package.json:
   - Open `package.json` and update the following versions:
     ```json
     "dependencies": {
       "next": "^14.0.0",
       "react": "^18.2.0",
       "react-dom": "^18.2.0"
     },
     "devDependencies": {
       "eslint-config-next": "^14.0.0"
     }
     ```
   - Remove the `--turbopack` flag from the "dev" script:
     ```json
     "scripts": {
       "dev": "next dev",
     }
     ```

3. Set up environment variables:
   - Copy the `.env.example` file to `.env`:
     ```
     cp .env.example .env
     ```
   - Open the `.env` file and fill in the actual values for each environment variable.

4. Clean npm cache and reinstall dependencies:
   ```
   npm cache clean --force
   rm -rf node_modules package-lock.json
   npm install
   ```

5. Build the project:
   ```
   npm run build
   ```

6. Start the production server:
   ```
   npm start
   ```

7. If you encounter any errors during the build process, please check the following:
   - Ensure all import statements in your code are correct
   - Check for any missing dependencies in package.json
   - Verify that your .env file contains all necessary environment variables

8. For deployment to a hosting platform like Vercel or Netlify:
   - Connect your GitHub repository to the hosting platform
   - Configure the environment variables in the hosting platform's dashboard (use the variables from your .env file)
   - The platform should automatically detect that it's a Next.js project and set up the build and start commands

## Troubleshooting

If you encounter any issues during deployment, please try the following:

1. Check the error logs for any specific error messages
2. Ensure all dependencies are compatible with Next.js 14
3. Verify that your code is compatible with React 18
4. If using any external APIs or services, make sure they are properly configured and accessible
5. Double-check that all required environment variables are set correctly

For further assistance, please consult the Next.js documentation or seek help from the Next.js community forums.