# Frontend-Backend Integration Setup Guide

## ✅ What's Been Set Up

Your React frontend is now fully connected to your MongoDB backend. Here's what was configured:

### Added to React Frontend:
1. **Axios** - HTTP client for API calls (installed in package.json)
2. **API Service Layer** - `src/services/api.js` - Centralized backend communication
3. **Environment Configuration** - `.env.local` - Backend URL configuration
4. **DonorDashboard** - Now fetches/creates donations via backend API
5. **NgoDashboard** - Now displays live donations from MongoDB

### Backend Ready:
- Express server running on PORT 5000
- MongoDB Atlas connection configured
- CORS enabled for React frontend
- Endpoints: `GET /api/donations` and `POST /api/donations`

---

## 🚀 Quick Start Instructions

### 1. Install Dependencies (Frontend)
```bash
cd my-react-app
npm install
```

### 2. Start the Backend Server
```bash
cd backend
npm install  # (if not already done)
npm run dev  # or: node server.js
```
The backend will run on: **http://localhost:5000**

### 3. Start the React Frontend (New Terminal)
```bash
cd my-react-app
npm run dev
```
The app will run on: **http://localhost:5173**

---

## 📱 Testing the Integration

### Add a Donation (Donor Dashboard):
1. Login as a **Donor**
2. Click "Add New Donation"
3. Fill in:
   - Food Type (e.g., "Biryani")
   - Quantity (e.g., "50 portions")
   - Pickup Window (e.g., "2-4 PM")
   - Location (e.g., "123 Main St")
4. Submit - Data saves to MongoDB instantly

### View Donations (NGO Dashboard):
1. Login as an **NGO**
2. See all donations in real-time from MongoDB
3. Click "Claim Food" to claim donations
4. Claimed items move to "Recent Claims" section

---

## 📁 File Structure

```
my-react-app/
├── .env.local                          # Backend URL config
├── package.json                        # Dependencies (now includes axios)
├── src/
│   ├── services/api.js                 # API communication layer
│   ├── pages/
│   │   ├── DonorDashboard.jsx         # Updated with backend calls
│   │   └── NgoDashboard.jsx           # Updated with backend calls
│   └── ...other files
└── ...
```

---

## 🔧 Configuration

### Backend URL (.env.local)
```
VITE_API_URL=http://localhost:5000
```
Change this if your backend runs on a different port.

### MongoDB Connection (backend/.env)
```
PORT=5000
MONGO_URI=mongodb+srv://bhanu:bhanu357@cluster0.g5nbf7k.mongodb.net/foodapp...
```
Already configured - no changes needed unless updating MongoDB cluster.

---

## 📋 API Endpoints Being Used

### GET /api/donations
- **Purpose**: Fetch all donations from MongoDB
- **Used by**: DonorDashboard (to show your donations), NgoDashboard (to show available food)
- **Response**: Array of donation objects with fields: foodType, quantity, location, pickupWindow, donorName, contact, notes, createdAt

### POST /api/donations
- **Purpose**: Create a new donation
- **Used by**: DonorDashboard (when submitting new donation)
- **Payload**: { donorName, foodType, quantity, pickupWindow, location, contact, notes }
- **Response**: Created donation object with MongoDB _id

---

## ⚠️ Troubleshooting

### Backend not connecting?
- ✅ Backend running on port 5000?
- ✅ VITE_API_URL in .env.local is correct?
- ✅ Check browser console for error messages

### Donations not showing?
- ✅ Did you click "Submit" on the donation form?
- ✅ Check browser Network tab to see API requests
- ✅ Check backend console for errors

### MongoDB connection failed?
- ✅ Check MONGO_URI in backend/.env
- ✅ Verify internet connection (MongoDB Atlas needs access)
- ✅ Check backend console logs

---

## 🎉 You're All Set!

Your food-sharing app is now fully functional with:
- ✅ Real MongoDB database
- ✅ Live data sync between frontend and backend
- ✅ Donor and NGO workflows
- ✅ Create and view donations in real-time

Start the servers and test it out!
