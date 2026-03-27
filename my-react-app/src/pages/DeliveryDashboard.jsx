import React, { useState } from 'react';
import { LogOut, Truck, MapPin, Clock, AlertCircle, Navigation, Leaf } from 'lucide-react';

export default function DeliveryDashboard({ user, onLogout }) {
  const [deliveries, setDeliveries] = useState([
    { id: 1, from: 'Grand Hotel', to: 'Hope NGO', food: 'Biryani (50 portions)', distance: '2.5 km', status: 'in-progress', eta: '15 mins' },
    { id: 2, from: 'Sunrise Bakery', to: 'Community Kitchen', food: 'Fresh Bread (25 loaves)', distance: '3.2 km', status: 'pending', eta: '—' },
    { id: 3, from: 'Local Market', to: 'Food Bank', food: 'Fresh Vegetables (15 kg)', distance: '1.8 km', status: 'completed', eta: '—' }
  ]);

  const handleStatusUpdate = (id, newStatus) => {
    setDeliveries(deliveries.map(d => d.id === id ? { ...d, status: newStatus } : d));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      {/* Navbar */}
      <nav className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Leaf className="w-6 h-6 text-purple-600" />
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Delivery Partner Dashboard</h1>
          <p className="text-gray-600">Manage your food delivery assignments</p>
        </div>

        {/* Active Deliveries Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Active Deliveries</p>
                <p className="text-3xl font-bold text-purple-600">1</p>
              </div>
              <Truck className="w-12 h-12 text-purple-200" />
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total This Week</p>
                <p className="text-3xl font-bold text-blue-600">12</p>
              </div>
              <Navigation className="w-12 h-12 text-blue-200" />
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Distance</p>
                <p className="text-3xl font-bold text-pink-600">48 km</p>
              </div>
              <MapPin className="w-12 h-12 text-pink-200" />
            </div>
          </div>
        </div>

        {/* Delivery List */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="text-lg font-bold text-gray-900">Your Deliveries</h2>
          </div>
          <div className="divide-y divide-gray-100">
            {deliveries.map((delivery) => (
              <div key={delivery.id} className="p-6 hover:bg-gray-50 transition">
                <div className="flex flex-col md:flex-row justify-between md:items-center gap-6 mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-900 mb-2">{delivery.food}</h3>
                    <div className="space-y-2 text-sm text-gray-600">
                      <p><strong>From:</strong> {delivery.from}</p>
                      <p><strong>To:</strong> {delivery.to}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4 text-sm">
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <span>{delivery.distance}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <span>{delivery.eta}</span>
                    </div>
                  </div>
                </div>

                {/* Status & Actions */}
                <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                  <div className="flex space-x-2">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      delivery.status === 'completed' ? 'bg-green-100 text-green-700' :
                      delivery.status === 'in-progress' ? 'bg-blue-100 text-blue-700' :
                      'bg-yellow-100 text-yellow-700'
                    }`}>
                      {delivery.status === 'completed' ? 'Completed' :
                       delivery.status === 'in-progress' ? 'In Progress' :
                       'Pending'}
                    </span>
                  </div>

                  {delivery.status === 'pending' && (
                    <button
                      onClick={() => handleStatusUpdate(delivery.id, 'in-progress')}
                      className="bg-purple-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-purple-700 transition"
                    >
                      Start Delivery
                    </button>
                  )}
                  {delivery.status === 'in-progress' && (
                    <button
                      onClick={() => handleStatusUpdate(delivery.id, 'completed')}
                      className="bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700 transition"
                    >
                      Complete Delivery
                    </button>
                  )}
                  {delivery.status === 'completed' && (
                    <span className="text-green-600 font-medium">✓ Delivered</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tips Box */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-2xl p-6 flex items-start space-x-3">
          <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-bold text-blue-900">Delivery Tips</h3>
            <p className="text-sm text-blue-700 mt-1">Handle food items with care, maintain proper temperature controls, and ensure timely delivery to prevent food spoilage.</p>
          </div>
        </div>
      </main>
    </div>
  );
}
