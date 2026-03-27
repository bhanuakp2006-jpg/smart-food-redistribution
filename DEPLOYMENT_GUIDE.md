# 🚀 Deployment Guide - FoodShare Hub

Deploy your FoodShare Hub application to production using **Vercel** (Frontend) and **Railway** (Backend).

---

## 📋 Prerequisites

1. **GitHub Account** - Push your code to GitHub
2. **Vercel Account** - https://vercel.com (free)
3. **Railway Account** - https://railway.app (free tier available)
4. **MongoDB Atlas** - Already set up with your cluster

---

## Step 1: Prepare Code for Deployment

### 1.1 Create `.env.example` files (Already Done ✅)

**Backend** - `.env.example`:
```env
PORT=5000
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/foodapp?retryWrites=true&w=majority
NODE_ENV=production
```

**Frontend** - `.env.example`:
```env
VITE_API_URL=https://your-backend-url.railway.app
```

### 1.2 Update `.gitignore`

Make sure these files are ignored (should already be set):

**Backend** - `backend/.gitignore`:
```
node_modules/
.env
.env.local
.DS_Store
*.log
```

**Frontend** - `my-react-app/.gitignore`:
```
node_modules/
.env.local
dist/
.DS_Store
*.log
```

---

## Step 2: Deploy Backend on Railway

### 2.1 Create Railway Account
1. Go to https://railway.app
2. Sign up with GitHub
3. Create a new project

### 2.2 Connect GitHub Repository
1. Click **"New Project"** → **"Deploy from GitHub repo"**
2. Select your repository
3. Select the **root folder** (dti)

### 2.3 Add Environment Variables in Railway
1. In Railway dashboard, click **"Add Variable"**
2. Add these variables:
   - **Key**: `PORT` → **Value**: `5000`
   - **Key**: `MONGO_URI` → **Value**: (Copy from your `.env` file)
   - **Key**: `NODE_ENV` → **Value**: `production`

### 2.4 Configure Deployment
1. Click on your service → **"Settings"**
2. Set **Root Directory**: `backend`
3. Set **Start Command**: `npm start`
4. Deploy will start automatically

### 2.5 Get Your Backend URL
- In Railway dashboard, find your deployment URL (looks like `https://xxx.railway.app`)
- Copy this URL - you'll need it for the frontend

---

## Step 3: Deploy Frontend on Vercel

### 3.1 Create Vercel Account
1. Go to https://vercel.com
2. Sign up with GitHub
3. Import your project

### 3.2 Import Project
1. Click **"Add New..."** → **"Project"**
2. Select your GitHub repository
3. Click **"Import"**

### 3.3 Configure Project Settings
1. **Framework Preset**: Vite
2. **Root Directory**: `my-react-app`
3. **Build Command**: `npm run build` (should auto-detect)
4. **Output Directory**: `dist`
5. **Install Command**: `npm install`

### 3.4 Add Environment Variables
1. Click **"Environment Variables"**
2. Add:
   - **Name**: `VITE_API_URL`
   - **Value**: `https://your-railway-backend-url.railway.app` (from Step 2.5)
   - **Environments**: Production, Preview, Development

### 3.5 Deploy
- Click **"Deploy"** button
- Vercel will build and deploy automatically
- Your frontend URL will be shown (e.g., `https://your-app.vercel.app`)

---

## Step 4: Connect Frontend to Backend

### 4.1 Update Frontend Environment
In `my-react-app/.env.local` (for local testing):
```env
VITE_API_URL=https://your-railway-backend-url.railway.app
```

### 4.2 Rebuild and Redeploy on Vercel
1. Commit and push changes to GitHub:
   ```bash
   git add .
   git commit -m "Update API URL for production"
   git push
   ```
2. Vercel will automatically rebuild and deploy

---

## Step 5: Test Live Deployment

1. Open your Vercel frontend URL
2. Try **creating an account** - should work without errors
3. Try **logging in** - should authenticate properly
4. Check backend logs in Railway dashboard for any errors

### If You Get CORS Errors:
Make sure `cors()` is enabled in `backend/server.js` (already done ✅)

---

## Step 6: Optional - Add Custom Domain

### For Frontend (Vercel):
1. Go to Vercel dashboard → Your project
2. Click **"Settings"** → **"Domains"**
3. Add your custom domain
4. Update DNS records (instructions in Vercel)

### For Backend (Railway):
1. Go to Railway dashboard → Your service
2. Click **"Settings"**
3. Add custom domain under **"Custom Domain"**
4. Update DNS records

---

## 🔍 Troubleshooting

### Backend Not Connecting
- ✅ Check MongoDB URI is correct
- ✅ Check PORT=5000 in Railway
- ✅ Verify CORS is enabled in backend
- ✅ Check backend logs in Railway dashboard

### Frontend Shows 404 Errors
- ✅ Make sure `VITE_API_URL` is set correctly in Vercel
- ✅ Check frontend logs in Vercel dashboard
- ✅ Verify ROOT DIRECTORY is set to `my-react-app` in Vercel

### Can't Login
- ✅ Check backend is running (Railway logs)
- ✅ Verify MongoDB connection works
- ✅ Check network tab in browser for failed requests

---

## 📊 Monitoring

### Railway Monitoring
- View logs in real-time
- Monitor CPU/Memory usage
- Check deployment history

### Vercel Monitoring
- View build logs
- Monitor performance
- Check analytics

---

## 💡 Tips

1. **Always test locally first** before committing
2. **Keep `.env` files secret** - never commit them to GitHub
3. **Use environment variables** for sensitive data
4. **Monitor logs regularly** for errors
5. **Test CORS** with frontend and backend together

---

## 📞 Support

- **Railway Docs**: https://docs.railway.app
- **Vercel Docs**: https://vercel.com/docs
- **MongoDB Docs**: https://docs.mongodb.com

---

**Happy Deploying! 🎉**
