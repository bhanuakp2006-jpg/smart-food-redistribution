# 🔧 Railway Build Failed - Troubleshooting Guide

## Quick Fixes Applied ✓

I've updated your backend deployment configs:
- `railway.json` - Updated with correct Railway schema
- `vercel.json` - Added if you want to use Vercel instead of Railway

---

## Common Railway Build Errors & Solutions

### 1. **"Cannot find module"** 
```
Error: Cannot find module 'express' or 'mongoose'
```
**Solution:**
- Make sure all dependencies are in `backend/package.json` ✓
- Railway will auto-run `npm install`
- Check if you pushed `package.json` to GitHub

### 2. **"Start Command Failed"**
```
Error: npm ERR! missing script: start
```
**Solution:**
- Verify `backend/package.json` has: `"start": "node server.js"` ✓
- Check the script is exactly correct

### 3. **"Port Not Exposed"**
```
Error: Cannot bind to port 5000
```
**Solution:**
- Railway sets random PORT on deployment
- Change `backend/server.js` line to:
```javascript
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```
✓ Already correct in your code

### 4. **"MongoDB Connection Failed"**
```
Error: connect ECONNREFUSED 127.0.0.1:27017
```
**Solution:**
- Verify `MONGO_URI` environment variable is set in Railway
- Check the URI is from MongoDB Atlas (not localhost)
- MongoDB URI should start with: `mongodb+srv://`

### 5. **"Node Version Issues"**
```
Error: Node version X not compatible
```
**Solution:**
- Create `backend/.nvmrc` or `backend/engines` in package.json
- Add this to `backend/package.json`:
```json
"engines": {
  "node": "18.x"
}
```

---

## How to Check Railway Logs

1. Go to https://railway.app/dashboard
2. Click on your project
3. Select the **backend service**
4. Click **Logs** tab
5. Look for red error messages
6. **Copy the exact error** and provide it

---

## Manual Fix Steps

### Option A: Remove railroad.json (Recommended for Railway)
Railway auto-detects Node.js configuration, so you may not need `railway.json`:

1. Delete `backend/railway.json` from GitHub
2. Push changes: `git push`
3. Railway will auto-redeploy

### Option B: Fix Node Version
Edit `backend/package.json` add after `"license"`:
```json
"engines": {
  "node": "18.x"
},
```

### Option C: Add Start Script Explicitly
Make sure this exists in `backend/package.json`:
```json
"scripts": {
  "start": "node server.js",
  "dev": "nodemon server.js"
}
```

---

## Deployment Checklist

- [ ] `backend/package.json` exists and has all dependencies
- [ ] `backend/server.js` exists and has no syntax errors
- [ ] `backend/.env` (local) has MONGO_URI set
- [ ] GitHub repository is pushed with all files
- [ ] `backend/` is set as root directory in Railway
- [ ] Environment variables are set in Railway dashboard:
  - [ ] `PORT` = `5000`
  - [ ] `MONGO_URI` = (your actual MongoDB URI)
  - [ ] `NODE_ENV` = `production`
- [ ] No `.env` file was committed to GitHub (should be in `.gitignore`)

---

## The Exact Error Message

**Please share the error message you see in Railway logs:**

- Go to Railway dashboard
- Click your backend service
- Click **Logs** tab
- Copy any red error messages
- Paste them here so I can give exact fix

---

## Alternative: Use Docker

If Railway deployment keeps failing, create `backend/Dockerfile`:

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 5000
CMD ["npm", "start"]
```

Then commit and push to GitHub. Railway will detect and use Dockerfile.

---

## Next Steps

1. **Check the actual error message** in Railway logs
2. **Share the error** with me
3. I'll provide exact solution for your error
