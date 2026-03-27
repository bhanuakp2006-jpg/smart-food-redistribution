import React, { useState, useEffect } from 'react';
import { LogOut, Truck, MapPin, CheckCircle, Activity, Phone } from 'lucide-react';
import { getNearbyDonations, claimDonation } from '../services/api';

export default function DeliveryDashboard({ user, onLogout }) {
  const [nearbyDonations, setNearbyDonations] = useState([]);
  const [otherDonations, setOtherDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [claimed, setClaimed] = useState([]);

  useEffect(() => {
    fetchDonations();
  }, [user?.id]);

  const fetchDonations = async () => {
    try {
      setLoading(true);
      const data = await getNearbyDonations(user.id);
      setNearbyDonations(data.nearby || []);
      setOtherDonations(data.other || []);
      setError(null);
    } catch (err) {
      setError('Failed to load donations');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleClaim = async (donationId) => {
    try {
      await claimDonation(donationId, user.id);

      // Remove from nearby or other lists
      setNearbyDonations(nearbyDonations.filter(d => d._id !== donationId));
      setOtherDonations(otherDonations.filter(d => d._id !== donationId));

      // Add to claimed
      const claimed_donation = nearbyDonations.find(d => d._id === donationId) ||
                                otherDonations.find(d => d._id === donationId);
      if (claimed_donation) {
        setClaimed([...claimed, claimed_donation]);
      }
    } catch (err) {
      setError('Failed to claim donation');
      console.error(err);
    }
  };

  const totalNearby = nearbyDonations.length;
  const totalOther = otherDonations.length;
  const claimedCount = claimed.length;

  const DonationCard = ({ donation, onClaim, buttonLabel = "Accept Delivery" }) => (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition">
      {/* Image */}
      {donation.image && (
        <img src={donation.image} alt={donation.foodType} className="w-full h-40 object-cover" />
      )}

      {/* Content */}
      <div className="p-4">
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-lg font-bold text-gray-900">{donation.foodType}</h3>
          <span className="text-xs font-semibold px-2 py-1 bg-green-100 text-green-800 rounded-full">
            Available
          </span>
        </div>

        <div className="space-y-2 text-sm text-gray-600 mb-4">
          <p>
            <span className="font-semibold">Quantity:</span> {donation.quantityValue} {donation.quantityUnit}
          </p>
          <p>
            <span className="font-semibold">Pickup:</span> {new Date(donation.pickupDate).toLocaleDateString()} at {donation.pickupTime}
          </p>
          <p className="flex items-center gap-1">
            <MapPin className="w-4 h-4" />
            <span>{donation.location.address}</span>
          </p>
          <p>
            <span className="font-semibold">Donor:</span> {donation.donorName}
          </p>
          {donation.donorId?.contact && (
            <p className="flex items-center gap-1">
              <Phone className="w-4 h-4" />
              <span>{donation.donorId.contact}</span>
            </p>
          )}
          {donation.notes && (
            <p>
              <span className="font-semibold">Notes:</span> {donation.notes}
            </p>
          )}
        </div>

        <button
          onClick={() => onClaim(donation._id)}
          className="w-full bg-purple-600 text-white py-2 rounded-lg font-semibold hover:bg-purple-700 transition"
        >
          {buttonLabel}
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="bg-purple-600 p-3 rounded-xl">
              <Truck className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Welcome, {user.name}</h1>
              <p className="text-gray-600">Find and deliver surplus food to those in need</p>
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
                <p className="text-gray-600 text-sm">Nearby Deliveries</p>
                <p className="text-3xl font-bold text-gray-900">{totalNearby}</p>
              </div>
              <MapPin className="w-10 h-10 text-green-600 opacity-30" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Other Locations</p>
                <p className="text-3xl font-bold text-gray-900">{totalOther}</p>
              </div>
              <Activity className="w-10 h-10 text-blue-600 opacity-30" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-purple-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Completed</p>
                <p className="text-3xl font-bold text-gray-900">{claimedCount}</p>
              </div>
              <CheckCircle className="w-10 h-10 text-purple-600 opacity-30" />
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Donations Grid */}
        {loading ? (
          <div className="text-center text-gray-600 p-8">Loading deliveries...</div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Nearby Deliveries */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <MapPin className="w-6 h-6 text-green-600" />
                Nearby Deliveries (Within 5 km)
              </h2>
              {nearbyDonations.length === 0 ? (
                <p className="text-gray-600 bg-white rounded-lg p-6">No nearby deliveries available</p>
              ) : (
                <div className="space-y-6">
                  {nearbyDonations.map((donation) => (
                    <DonationCard
                      key={donation._id}
                      donation={donation}
                      onClaim={handleClaim}
                      buttonLabel="Accept Delivery"
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Other Deliveries */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Activity className="w-6 h-6 text-blue-600" />
                Other Locations
              </h2>
              {otherDonations.length === 0 ? (
                <p className="text-gray-600 bg-white rounded-lg p-6">No other deliveries available</p>
              ) : (
                <div className="space-y-6">
                  {otherDonations.map((donation) => (
                    <DonationCard
                      key={donation._id}
                      donation={donation}
                      onClaim={handleClaim}
                      buttonLabel="Accept Delivery"
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Completed Deliveries */}
        {claimed.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Completed Deliveries</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {claimed.map((donation) => (
                <div key={donation._id} className="bg-white rounded-lg border border-green-200 overflow-hidden opacity-75">
                  {donation.image && (
                    <img src={donation.image} alt={donation.foodType} className="w-full h-40 object-cover" />
                  )}
                  <div className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <span className="text-sm font-semibold text-green-800">Delivered</span>
                    </div>
                    <h3 className="font-bold text-gray-900">{donation.foodType}</h3>
                    <p className="text-sm text-gray-600 mt-2">{donation.quantityValue} {donation.quantityUnit}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
