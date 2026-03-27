import React, { useState, useEffect } from 'react';
import { LogOut, Plus, Leaf, TrendingUp, ClipboardCheck } from 'lucide-react';
import { getDonations, createDonation } from '../services/api';

export default function DonorDashboard({ user, onLogout }) {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    donorName: user.name || '',
    foodType: '',
    quantity: '',
    pickupWindow: '',
    location: '',
    contact: user.email || '',
    notes: ''
  });

  // Fetch donations on component mount
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

  const handleAddDonation = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    try {
      // Convert quantity to number before sending
      const donationData = {
        ...formData,
        quantity: parseInt(formData.quantity) || 0
      };
      await createDonation(donationData);
      // Reset form and show success
      setFormData({
        donorName: user.name || '',
        foodType: '',
        quantity: '',
        pickupWindow: '',
        location: '',
        contact: user.email || '',
        notes: ''
      });
      setSuccess(true);
      setShowForm(false);
      // Refresh donations list
      await fetchDonations();
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create donation');
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
      {/* Navbar */}
      <nav className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Leaf className="w-6 h-6 text-orange-600" />
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Donor Dashboard</h1>
          <p className="text-gray-600">Share surplus food and track your impact</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Donations</p>
                <p className="text-3xl font-bold text-orange-600">{donations.length}</p>
              </div>
              <Plus className="w-12 h-12 text-orange-200" />
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Quantity</p>
                <p className="text-3xl font-bold text-red-600">
                  {donations.reduce((sum, d) => sum + (parseInt(d.quantity) || 0), 0)}
                </p>
              </div>
              <TrendingUp className="w-12 h-12 text-red-200" />
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Impact Score</p>
                <p className="text-3xl font-bold text-green-600">{donations.length * 10}</p>
              </div>
              <Leaf className="w-12 h-12 text-green-200" />
            </div>
          </div>
        </div>

        {/* Add New Donation Button */}
        <div className="mb-8">
          {!showForm && (
            <button 
              onClick={() => setShowForm(true)}
              className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-3 rounded-lg font-bold flex items-center space-x-2 hover:shadow-lg transition"
            >
              <Plus className="w-5 h-5" />
              <span>Add New Donation</span>
            </button>
          )}
          
          {showForm && (
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h2 className="text-xl font-bold mb-4">New Donation</h2>
              
              {error && (
                <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                  {error}
                </div>
              )}
              
              {success && (
                <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded-lg">
                  Donation created successfully! ✓
                </div>
              )}
              
              <form onSubmit={handleAddDonation} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Your Name"
                    required
                    value={formData.donorName}
                    onChange={(e) => setFormData({...formData, donorName: e.target.value})}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                  />
                  <input
                    type="email"
                    placeholder="Your Email/Contact"
                    required
                    value={formData.contact}
                    onChange={(e) => setFormData({...formData, contact: e.target.value})}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                  />
                  <input
                    type="text"
                    placeholder="Food Type"
                    required
                    value={formData.foodType}
                    onChange={(e) => setFormData({...formData, foodType: e.target.value})}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                  />
                  <input
                    type="text"
                    placeholder="Quantity"
                    required
                    value={formData.quantity}
                    onChange={(e) => setFormData({...formData, quantity: e.target.value})}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                  />
                  <input
                    type="text"
                    placeholder="Pickup Window (e.g., 2-4 PM)"
                    required
                    value={formData.pickupWindow}
                    onChange={(e) => setFormData({...formData, pickupWindow: e.target.value})}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                  />
                  <input
                    type="text"
                    placeholder="Location"
                    required
                    value={formData.location}
                    onChange={(e) => setFormData({...formData, location: e.target.value})}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                  />
                </div>
                <textarea
                  placeholder="Additional Notes"
                  value={formData.notes}
                  onChange={(e) => setFormData({...formData, notes: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                  rows="3"
                />
                <div className="flex space-x-4">
                  <button
                    type="submit"
                    className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-2 rounded-lg font-medium"
                  >
                    Submit
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-6 py-2 rounded-lg font-medium"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>

        {/* Donations List */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="text-lg font-bold text-gray-900 flex items-center space-x-2">
              <ClipboardCheck className="w-5 h-5" />
              <span>Your Donations</span>
            </h2>
          </div>
          
          {error && (
            <div className="px-6 py-4 bg-red-50 border-b border-red-200 text-red-700">
              {error}
            </div>
          )}
          
          {loading ? (
            <div className="px-6 py-8 text-center text-gray-500">
              Loading donations...
            </div>
          ) : donations.length === 0 ? (
            <div className="px-6 py-8 text-center text-gray-500">
              No donations yet. Click "Add New Donation" to get started!
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Food Type</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Quantity</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Location</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Pickup Time</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Posted</th>
                  </tr>
                </thead>
                <tbody>
                  {donations.map((donation) => (
                    <tr key={donation._id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="px-6 py-4 text-gray-900 font-medium">{donation.foodType}</td>
                      <td className="px-6 py-4 text-gray-600">{donation.quantity}</td>
                      <td className="px-6 py-4 text-gray-600">{donation.location}</td>
                      <td className="px-6 py-4 text-gray-600 text-sm">{donation.pickupWindow}</td>
                      <td className="px-6 py-4 text-gray-600 text-sm">
                        {new Date(donation.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
