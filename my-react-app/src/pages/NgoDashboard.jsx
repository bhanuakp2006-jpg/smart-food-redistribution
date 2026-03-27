import React, { useState, useEffect } from 'react';
import { LogOut, CheckCircle, Clock, MapPin, Leaf, Users, Activity } from 'lucide-react';
import { getDonations } from '../services/api';

export default function NgoDashboard({ user, onLogout }) {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [claimed, setClaimed] = useState([]);

  useEffect(() => {
    fetchDonations();
  }, []);

  const fetchDonations = async () => {
    try {
      setLoading(true);
      const data = await getDonations();
      setDonations(data);
      setError(null);
    } catch (err) {
      setError('Failed to load donations');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleClaim = (donationId, donation) => {
    // Add to claimed list
    setClaimed([...claimed, donation]);
    // Remove from donations
    setDonations(donations.filter(d => d._id !== donationId));
  };

  const availableCount = donations.length;
  const claimedCount = claimed.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50">
      {/* Navbar */}
      <nav className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Leaf className="w-6 h-6 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">FoodShare Hub</span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">Welcome, <strong>{user.name}</strong></span>
              <button
                onClick={onLogout}
                className="flex items-center space-x-1 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition"
              >
                <LogOut className="w-5 h-5" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">NGO Dashboard</h1>
          <p className="text-gray-600">Find and claim surplus food for your beneficiaries</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Claimed So Far</p>
                <p className="text-3xl font-bold text-blue-600">{claimedCount}</p>
              </div>
              <CheckCircle className="w-12 h-12 text-blue-200" />
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Quantity</p>
                <p className="text-3xl font-bold text-cyan-600">
                  {donations.reduce((sum, d) => sum + (parseInt(d.quantity) || 0), 0) + claimed.reduce((sum, d) => sum + (parseInt(d.quantity) || 0), 0)}
                </p>
              </div>
              <Users className="w-12 h-12 text-cyan-200" />
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Available Now</p>
                <p className="text-3xl font-bold text-green-600">{availableCount}</p>
              </div>
              <Activity className="w-12 h-12 text-green-200" />
            </div>
          </div>
        </div>

        {/* Available Food */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-8">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="text-lg font-bold text-gray-900">Available Food Listings</h2>
          </div>
          
          {error && (
            <div className="px-6 py-4 bg-red-50 border-b border-red-200 text-red-700">
              {error}
            </div>
          )}
          
          {loading ? (
            <div className="px-6 py-8 text-center text-gray-500">
              Loading available food...
            </div>
          ) : donations.length === 0 ? (
            <div className="px-6 py-8 text-center text-gray-500">
              No food available at the moment. Check back soon!
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {donations.map((item) => (
                <div key={item._id} className="p-6 hover:bg-gray-50 transition">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">{item.foodType}</h3>
                      <p className="text-gray-600 text-sm">By: {item.donorName}</p>
                    </div>
                    <span className="px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-700">
                      Available
                    </span>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 text-sm">
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600">{item.pickupWindow}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600">{item.location}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-gray-600">Qty: {item.quantity}</span>
                    </div>
                    <button
                      onClick={() => handleClaim(item._id, item)}
                      className="col-span-2 md:col-span-1 bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition"
                    >
                      Claim Food
                    </button>
                  </div>
                  {item.notes && (
                    <p className="text-sm text-gray-600 italic">Notes: {item.notes}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Claimed History */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Recent Claims ({claimed.length})</h2>
          <div className="space-y-3">
            {claimed.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No claims yet</p>
            ) : (
              claimed.map((item) => (
                <div key={item._id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{item.foodType} from {item.donorName}</p>
                    <p className="text-sm text-gray-600">{item.quantity} - Pickup: {item.pickupWindow}</p>
                  </div>
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </div>
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
