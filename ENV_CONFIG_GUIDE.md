# Environment Configuration Guide

This document explains how to manage environment variables across development, staging, and production.

## Backend Environment Variables

### Development (local/.env)
```env
PORT=5000
MONGO_URI=mongodb+srv://bhanu:bhanu357@cluster0.g5nbf7k.mongodb.net/foodapp?retryWrites=true&w=majority
NODE_ENV=development
```

### Production (Railway)
```env
PORT=5000
MONGO_URI=mongodb+srv://bhanu:bhanu357@cluster0.g5nbf7k.mongodb.net/foodapp?retryWrites=true&w=majority
NODE_ENV=production
```

**Note**: Same MongoDB URI works fine - it's already in MongoDB Atlas

---

## Frontend Environment Variables

### Development (my-react-app/.env.local)
```env
VITE_API_URL=http://localhost:5000
```

### Production (Vercel)
```env
VITE_API_URL=https://your-railway-backend.railway.app
```

---

## How Vite Loads Environment Variables

Vite automatically prefixes variables with `VITE_` to expose them to the client.

In your code:
```javascript
const API_URL = import.meta.env.VITE_API_URL
```

---

## Important Security Notes

1. **Never commit `.env` files** to Git
2. **Keep MongoDB credentials safe**
3. **Use Railway's secret management** for sensitive data
4. **Don't hardcode API URLs** in your code

---

## Deployment Checklist

- [ ] Backend `.env.example` created
- [ ] Frontend `.env.local` ready
- [ ] GitHub repository is public/private as needed
- [ ] Railway backend deployed
- [ ] Vercel frontend deployed
- [ ] Environment variables set in both platforms
- [ ] CORS is enabled on backend
- [ ] Frontend can reach backend API
- [ ] Login/Signup works on production

---

## Troubleshooting

### CORS Errors
If frontend can't reach backend, check:
1. Backend has `cors()` enabled ✓ (already done in server.js)
2. `VITE_API_URL` env variable is set correctly in Vercel
3. Backend URL is publicly accessible

### 404 Errors
1. Check Vite output directory is `dist`
2. Check root directory in Vercel is `my-react-app`
3. Build command is `npm run build`

### Login Fails
1. Check MongoDB connection in Railway logs
2. Verify PORT=5000 in Railway env vars
3. Check backend error logs for clues
