# Render Deployment Configuration for Node.js Backend

# 1. Create a new web service at https://dashboard.render.com/
# 2. Connect your GitHub repo and select the backend folder.
# 3. Set the following settings:
#    - Environment: Node
#    - Build Command: npm install
#    - Start Command: npm run start or node server.js
#    - Root Directory: backend
#    - Add environment variables (from your .env file):
#        - MONGODB_URI
#        - Any other required variables
# 4. Click "Create Web Service". Render will build and deploy your backend.
# 5. Note the public API URL for use in your frontend (set as VITE_API_URL in Netlify).

# Optional: Add a render.yaml for Infrastructure as Code (advanced)
