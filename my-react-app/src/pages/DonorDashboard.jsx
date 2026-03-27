import React, { useState, useEffect } from 'react';
import { LogOut, Plus, Leaf, TrendingUp, X, Upload } from 'lucide-react';
import { getUserDonations, createDonation } from '../services/api';
import MapPicker from '../components/MapPicker';

export default function DonorDashboard({ user, onLogout }) {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [formData, setFormData] = useState({
    donorId: user?.id || '',
    donorName: user?.name || '',
    foodType: '',
    quantityValue: '',
    quantityUnit: 'kg',
    pickupDate: '',
    pickupTime: '',
    location: null,
    contact: user?.email || '',
    notes: '',
    image: null
  });

  // Fetch user's donations on component mount
  useEffect(() => {
    fetchDonations();
  }, [user?.id]);

  const fetchDonations = async () => {
    try {
      setLoading(true);
      const data = await getUserDonations(user.id);
      setDonations(data);
      setError(null);
    } catch (err) {
      setError('Failed to load your donations');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Convert image to base64 for storage
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, image: reader.result });
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddDonation = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    
    try {
      // Validation
      if (!formData.foodType || !formData.quantityValue || !formData.quantityUnit || 
          !formData.pickupDate || !formData.pickupTime || !formData.location) {
        setError('Please fill all required fields');
        return;
      }

      const donationData = {
        ...formData,
        quantityValue: Number(formData.quantityValue),
        location: formData.location
      };

      await createDonation(donationData);
      
      setSuccess(true);
      setShowForm(false);
      
      // Reset form
      setFormData({
        donorId: user?.id || '',
        donorName: user?.name || '',
        foodType: '',
        quantityValue: '',
        quantityUnit: 'kg',
        pickupDate: '',
        pickupTime: '',
        location: null,
        contact: user?.email || '',
        notes: '',
        image: null
      });
      setImagePreview(null);

      // Refresh donations list
      setTimeout(() => {
        fetchDonations();
        setSuccess(false);
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create donation');
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="bg-green-600 p-3 rounded-xl">
              <Leaf className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Welcome, {user.name}</h1>
              <p className="text-gray-600">Manage your food donations</p>
            </div>
          </div>
          <button
            onClick={onLogout}
            className="flex items-center gap-2 bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Active Donations</p>
                <p className="text-3xl font-bold text-gray-900">
                  {donations.filter(d => d.isAvailable).length}
                </p>
              </div>
              <TrendingUp className="w-10 h-10 text-green-600 opacity-30" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Donations</p>
                <p className="text-3xl font-bold text-gray-900">{donations.length}</p>
              </div>
              <Leaf className="w-10 h-10 text-blue-600 opacity-30" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-purple-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Claimed</p>
                <p className="text-3xl font-bold text-gray-900">
                  {donations.filter(d => !d.isAvailable).length}
                </p>
              </div>
              <TrendingUp className="w-10 h-10 text-purple-600 opacity-30" />
            </div>
          </div>
        </div>

        {/* Error and Success Messages */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}
        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6">
            Donation created successfully!
          </div>
        )}

        {/* Add Donation Button */}
        <div className="mb-8">
          {!showForm && (
            <button
              onClick={() => setShowForm(true)}
              className="flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition font-semibold"
            >
              <Plus className="w-5 h-5" />
              Add New Donation
            </button>
          )}

          {showForm && (
            <div className="bg-white rounded-lg shadow-lg p-8 border border-gray-200">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Create New Donation</h2>
                <button
                  onClick={() => {
                    setShowForm(false);
                    setImagePreview(null);
                  }}
                  className="text-gray-600 hover:text-gray-900"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleAddDonation} className="space-y-6">
                {/* Food Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Food Type</label>
                  <input
                    type="text"
                    value={formData.foodType}
                    onChange={(e) => setFormData({ ...formData, foodType: e.target.value })}
                    placeholder="e.g., Cooked Rice, Vegetables, Fruits"
                    className="w-full border-2 border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-green-500"
                    required
                  />
                </div>

                {/* Quantity with Unit */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
                    <input
                      type="number"
                      step="0.1"
                      value={formData.quantityValue}
                      onChange={(e) => setFormData({ ...formData, quantityValue: e.target.value })}
                      placeholder="e.g., 10"
                      className="w-full border-2 border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-green-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Unit</label>
                    <select
                      value={formData.quantityUnit}
                      onChange={(e) => setFormData({ ...formData, quantityUnit: e.target.value })}
                      className="w-full border-2 border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-green-500"
                    >
                      <option value="kg">Kg</option>
                      <option value="litres">Litres</option>
                      <option value="units">Units</option>
                    </select>
                  </div>
                </div>

                {/* Pickup Date & Time */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Pickup Date</label>
                    <input
                      type="date"
                      value={formData.pickupDate}
                      onChange={(e) => setFormData({ ...formData, pickupDate: e.target.value })}
                      className="w-full border-2 border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-green-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Pickup Time</label>
                    <input
                      type="time"
                      value={formData.pickupTime}
                      onChange={(e) => setFormData({ ...formData, pickupTime: e.target.value })}
                      className="w-full border-2 border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-green-500"
                      required
                    />
                  </div>
                </div>

                {/* Location Map */}
                <div>
                  <MapPicker onLocationSelect={(loc) => setFormData({ ...formData, location: loc })} />
                </div>

                {/* Image Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Upload Food Image</label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      id="image-upload"
                    />
                    <label htmlFor="image-upload" className="cursor-pointer flex flex-col items-center gap-2">
                      <Upload className="w-6 h-6 text-gray-400" />
                      <span className="text-gray-700 font-medium">Click to upload image</span>
                      <span className="text-gray-500 text-sm">PNG, JPG up to 5MB</span>
                    </label>
                  </div>
                  {imagePreview && (
                    <div className="mt-4">
                      <img src={imagePreview} alt="Preview" className="max-h-40 mx-auto rounded-lg" />
                    </div>
                  )}
                </div>

                {/* Notes */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Additional Notes</label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    placeholder="e.g., Vegetarian, No Dairy, etc."
                    className="w-full border-2 border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-green-500"
                    rows="3"
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="w-full bg-green-600 text-white py-3 rounded-lg font-bold hover:bg-green-700 transition"
                >
                  Create Donation
                </button>
              </form>
            </div>
          )}
        </div>

        {/* Donations List */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Donations</h2>
          
          {loading ? (
            <p className="text-gray-600">Loading donations...</p>
          ) : donations.length === 0 ? (
            <p className="text-gray-600">No donations yet. Create your first donation!</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {donations.map((donation) => (
                <div key={donation._id} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition">
                  {/* Image */}
                  {donation.image && (
                    <img src={donation.image} alt={donation.foodType} className="w-full h-40 object-cover" />
                  )}
                  
                  {/* Content */}
                  <div className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-lg font-bold text-gray-900">{donation.foodType}</h3>
                      <span className={`text-sm font-semibold px-3 py-1 rounded-full ${
                        donation.isAvailable
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {donation.isAvailable ? 'Available' : 'Claimed'}
                      </span>
                    </div>

                    <div className="space-y-2 text-sm text-gray-600">
                      <p>
                        <span className="font-semibold">Quantity:</span> {donation.quantityValue} {donation.quantityUnit}
                      </p>
                      <p>
                        <span className="font-semibold">Pickup:</span> {new Date(donation.pickupDate).toLocaleDateString()} at {donation.pickupTime}
                      </p>
                      <p>
                        <span className="font-semibold">Location:</span> {donation.location.address}
                      </p>
                      {donation.notes && (
                        <p>
                          <span className="font-semibold">Notes:</span> {donation.notes}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
