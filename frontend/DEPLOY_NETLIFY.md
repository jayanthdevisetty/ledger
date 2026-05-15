# Instructions: Deploying Frontend (Netlify)

1. Go to https://app.netlify.com/ and sign in (or sign up).
2. Click "Add new site" > "Import an existing project".
3. Connect your GitHub repo (or drag-and-drop the frontend folder if using manual deploy).
4. Set build settings:
   - **Build command:** npm run build
   - **Publish directory:** dist
5. Netlify auto-detects Vite/React, but you can set environment variables if needed (e.g., VITE_API_URL).
6. Deploy! Netlify will build and host your site. Use the generated URL.

# Notes
- The `netlify.toml` file is already created for SPA routing support.
- For API calls, set your backend URL in `VITE_API_URL` in Netlify dashboard (Site settings > Environment variables).
