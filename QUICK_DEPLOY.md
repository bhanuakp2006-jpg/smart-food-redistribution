# 🚀 Quick Deployment Guide - 5 Minutes to Live

## Step 1: Prepare Your Code (1 min)

### Push to GitHub
```bash
# In your project root
git init
git add .
git commit -m "Ready for deployment"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/dti.git
git push -u origin main
```

---

## Step 2: Deploy Backend on Railway (2 mins)

1. **Go to** https://railway.app → Sign up with GitHub
2. **Click** "New Project" → "Deploy from GitHub repo"
3. **Select** your `dti` repository
4. **In Railway Dashboard**, click your service → "Settings"
   - Set **Root Directory**: `backend`
   - Set **Publish Directory**: (leave empty)
5. **Add Environment Variables**:
   - `PORT` = `5000`
   - `MONGO_URI` = (copy from `backend/.env`)
   - `NODE_ENV` = `production`

✅ **Your backend is on**: `https://xxxx.railway.app`

---

## Step 3: Deploy Frontend on Vercel (2 mins)

1. **Go to** https://vercel.com → Sign up with GitHub → "Add New Project"
2. **Select** your `dti` repository
3. **Configure**:
   - Framework: **Vite**
   - Root Directory: **my-react-app**
   - Build Command: `npm run build`
4. **Add Environment Variable**:
   - Name: `VITE_API_URL`
   - Value: `https://xxxx.railway.app` (your Railway backend URL)
5. **Click Deploy** ✅

✅ **Your app is at**: `https://xxxx.vercel.app`

---

## That's It! 🎉

Your FoodShare Hub is now LIVE and accessible worldwide!

### Test It:
1. Go to your Vercel URL
2. Create a test account
3. Add a donation
4. Switch user type and see the donation listed

---

## If Something Goes Wrong:

| Issue | Solution |
|-------|----------|
| **Backend connection error** | Check `VITE_API_URL` in Vercel matches Railway URL |
| **Login fails** | Check backend logs in Railway dashboard |
| **Page shows 404** | Make sure Root Directory is set to `my-react-app` in Vercel |

---

**Need more details?** See `DEPLOYMENT_GUIDE.md`

**Questions?**
- Railway: https://docs.railway.app
- Vercel: https://vercel.com/docs
