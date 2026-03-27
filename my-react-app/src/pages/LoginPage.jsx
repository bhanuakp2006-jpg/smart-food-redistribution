import React, { useState } from 'react';
import { Leaf, Mail, Lock, ArrowRight, User } from 'lucide-react';
import { loginUser, registerUser, testBackendConnection } from '../services/api';

export default function LoginPage({ onLogin }) {
  const [userType, setUserType] = useState(null);
  const [isSignUp, setIsSignUp] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      if (!formData.email || !formData.password) {
        setError('Please fill in all fields');
        setLoading(false);
        return;
      }

      const response = await loginUser(formData.email, formData.password, userType);
      console.log('Login successful:', response);
      onLogin(userType, response.user);
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    console.log('Starting signup process...');
    console.log('UserType:', userType);
    console.log('FormData:', formData);

    try {
      if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
        setError('Please fill in all fields');
        setLoading(false);
        return;
      }

      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match');
        setLoading(false);
        return;
      }

      if (formData.password.length < 6) {
        setError('Password must be at least 6 characters');
        setLoading(false);
        return;
      }

      if (!userType) {
        setError('Please select a user type first');
        setLoading(false);
        return;
      }

      console.log('Calling registerUser API...');
      const response = await registerUser({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        userType
      });

      console.log('Registration successful:', response);
      setSuccess('Account created successfully! Now logging in...');
      
      // Auto login after signup
      setTimeout(() => {
        onLogin(userType, response.user);
      }, 1500);
    } catch (err) {
      console.error('Registration failed:', err);
      console.error('Error response:', err.response);
      setError(err.response?.data?.message || 'Failed to create account. Please check if the backend server is running.');
    } finally {
      setLoading(false);
    }
  };

  if (!userType) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="max-w-4xl w-full">
          {/* Logo */}
          <div className="flex items-center justify-center mb-12">
            <div className="bg-green-600 p-3 rounded-2xl">
              <Leaf className="h-8 w-8 text-white" />
            </div>
            <span className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-blue-600 ml-3">
              FoodShare Hub
            </span>
          </div>

          {/* Main Content */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Welcome to FoodShare Hub
            </h1>
            <p className="text-xl text-gray-600">
              Connect food donors, NGOs, and delivery partners to reduce waste and fight hunger.
            </p>
          </div>

          {/* User Type Selection */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {[
              { type: 'donor', title: 'Donor', description: 'Share surplus food', icon: '🍲', color: 'from-orange-500 to-red-500' },
              { type: 'ngo', title: 'NGO/Organization', description: 'Claim and distribute food', icon: '🤝', color: 'from-blue-500 to-cyan-500' },
              { type: 'delivery', title: 'Delivery Partner', description: 'Help transport food', icon: '🚗', color: 'from-purple-500 to-pink-500' }
            ].map((option) => (
              <button
                key={option.type}
                onClick={() => setUserType(option.type)}
                className="p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all transform hover:scale-105 border-2 border-gray-100 hover:border-gray-300"
              >
                <div className={`text-4xl mb-4 bg-gradient-to-r ${option.color} bg-clip-text text-transparent`}>
                  {option.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{option.title}</h3>
                <p className="text-gray-600 text-sm">{option.description}</p>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Back Button */}
        <button
          onClick={() => { setUserType(null); setFormData({ email: '', password: '' }); setError(''); }}
          className="mb-8 text-gray-600 hover:text-gray-900 flex items-center space-x-1"
        >
          <span>← Back</span>
        </button>

        {/* Card */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-100">
          {/* Logo */}
          <div className="flex items-center justify-center mb-8">
            <div className="bg-green-600 p-2 rounded-xl">
              <Leaf className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-blue-600 ml-2">
              FoodShare Hub
            </span>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mb-2 text-center">
            {isSignUp ? 'Create Your Account' : (userType === 'donor' ? 'Donor Login' : userType === 'ngo' ? 'NGO Login' : 'Delivery Partner Login')}
          </h2>
          <p className="text-gray-600 text-center mb-8">
            {isSignUp ? 'Join FoodShare Hub to get started' : 'Sign in to your account to continue'}
          </p>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6">
              {success}
            </div>
          )}

          <form onSubmit={isSignUp ? handleSignUp : handleLogin} className="space-y-5">
            {/* Name Field - Only for Sign Up */}
            {isSignUp && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="John Doe"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition"
                  />
                </div>
              </div>
            )}

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="you@example.com"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition"
                />
              </div>
            </div>

            {/* Confirm Password - Only for Sign Up */}
            {isSignUp && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="password"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition"
                  />
                </div>
              </div>
            )}

            {/* Remember & Forgot - Only for Login */}
            {!isSignUp && (
              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center">
                  <input type="checkbox" className="w-4 h-4 rounded border-gray-300" />
                  <span className="ml-2 text-gray-600">Remember me</span>
                </label>
                <button type="button" className="text-green-600 hover:text-green-700 font-medium">
                  Forgot password?
                </button>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-green-600 to-blue-600 text-white py-3 rounded-lg font-bold hover:shadow-lg transition-all flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span>{loading ? 'Processing...' : (isSignUp ? 'Create Account' : 'Sign In')}</span>
              {!loading && <ArrowRight className="w-5 h-5" />}
            </button>
          </form>

          {/* Toggle Sign Up / Login */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">
                {isSignUp ? 'Already have an account?' : "Don't have an account?"}
              </span>
            </div>
          </div>

          {/* Toggle Button */}
          <button 
            type="button"
            onClick={() => {
              setIsSignUp(!isSignUp);
              setFormData({ name: '', email: '', password: '', confirmPassword: '' });
              setError('');
              setSuccess('');
            }}
            className="w-full border-2 border-gray-300 text-gray-700 py-3 rounded-lg font-bold hover:bg-gray-50 transition"
          >
            {isSignUp ? 'Back to Login' : 'Create Account'}
          </button>

          {/* Test Backend Connection */}
          <button
            type="button"
            onClick={async () => {
              try {
                setError('');
                const response = await testBackendConnection();
                setSuccess('Backend is connected! Server response: ' + response);
              } catch (err) {
                setError('Backend not reachable. Please start the backend server.');
                console.error('Backend test failed:', err);
              }
            }}
            className="w-full mt-4 bg-gray-500 text-white py-2 rounded-lg font-medium hover:bg-gray-600 transition text-sm"
          >
            Test Backend Connection
          </button>
        </div>
      </div>
    </div>
  );
}
