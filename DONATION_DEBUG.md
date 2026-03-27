# 🔍 Donation Creation Debug Guide

## Issue: "Failed to create donation" on live site

This error typically means the frontend can't reach the backend API. Here's how to debug:

---

## ✅ FIXED: Body Parser Limits

**Issue:** `413 Payload Too Large` error when uploading images
**Solution:** Backend now supports up to 10MB payloads for image uploads

---

## 1. Check Environment Variables

### In Render Frontend Service:
- Go to your **frontend service** (not backend)
- **Environment** tab
- Verify: `VITE_API_URL = https://your-backend.onrender.com`
- **Redeploy** if you changed it

### Test API URL:
- Open browser → `https://your-backend.onrender.com/api/donations`
- Should return: `[]` or JSON array (empty donations list)
- If you see "Server is running" → wrong URL (that's the root endpoint)

---

## 2. Check Browser Console

### Open DevTools (F12) on your live site:
1. Go to **Network** tab
2. Try to create a donation
3. Look for failed requests to `/api/donations`
4. Check **Response** tab for error details

### Common errors:
- **CORS error**: Backend URL mismatch
- **404**: Wrong API URL
- **413**: Payload too large (FIXED - now supports 10MB)
- **500**: Backend server error

---

## 3. Test Backend Directly

### From browser or terminal:
```bash
curl https://your-backend.onrender.com/api/donations
```

Should return: `[]` or `{"message": "Error fetching donations"}`

### Test donation creation:
```bash
curl -X POST https://your-backend.onrender.com/api/donations \
  -H "Content-Type: application/json" \
  -d '{
    "donorId": "test",
    "donorName": "Test User",
    "foodType": "Rice",
    "quantityValue": 10,
    "quantityUnit": "kg",
    "pickupDate": "2026-03-28",
    "pickupTime": "14:00",
    "location": {"latitude": 28.6139, "longitude": 77.2090, "address": "Delhi"},
    "contact": "test@example.com"
  }'
```

---

## 4. Check Render Logs

### Backend Service Logs:
- Go to Render dashboard → Your backend service
- **Logs** tab
- Look for errors when donation creation is attempted
- Check MongoDB connection: should see "MongoDB connected"

### Frontend Service Logs:
- Check for build errors or missing env vars

---

## 5. Common Fixes

### If API URL is wrong:
```bash
# In frontend Render env vars
VITE_API_URL=https://your-backend-service-name.onrender.com
```

### If CORS error:
- Backend already has `cors()` enabled ✓
- Make sure frontend URL matches allowed origins if customized

### If MongoDB error:
- Check `MONGO_URI` in backend Render env vars
- Verify MongoDB Atlas allows your Render IP

### If location validation fails:
- Ensure MapPicker returns: `{latitude, longitude, address}`
- Check that user clicks/selects location on map

### If image upload fails:
- Backend now supports 10MB payloads ✓
- Check image file size (should be < 5MB for base64)

---

## 6. Quick Test Script

Create `test-api.html` locally and open in browser:

```html
<!DOCTYPE html>
<html>
<body>
  <h1>API Test</h1>
  <script>
    const API_URL = 'https://your-backend.onrender.com';

    // Test 1: Health check
    fetch(API_URL + '/')
      .then(r => r.text())
      .then(d => console.log('Health:', d));

    // Test 2: Get donations
    fetch(API_URL + '/api/donations')
      .then(r => r.json())
      .then(d => console.log('Donations:', d))
      .catch(e => console.error('Error:', e));
  </script>
</body>
</html>
```

---

## 7. If Everything Looks Correct

The issue might be in the frontend code. Check:

1. **API service** (`src/services/api.js`):
   ```javascript
   const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
   console.log('API_URL:', API_URL); // Add this to debug
   ```

2. **Donation data structure** matches backend expectations

3. **Location object** has required fields

---

## Next Steps

1. **Verify VITE_API_URL** in Render frontend env vars
2. **Check browser Network tab** for failed API calls
3. **Test backend directly** with curl
4. **Share the exact error** from browser console or Render logs

Most likely: API URL not set correctly in frontend deployment! 🎯