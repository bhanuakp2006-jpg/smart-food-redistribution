import axios from 'axios';

// Use environment variable or default to localhost for development
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// User APIs
export const registerUser = async (userData) => {
  try {
    console.log('Registering user:', userData);
    const response = await apiClient.post('/api/users/register', userData);
    console.log('Registration successful:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error during registration:', error);
    console.error('Response status:', error.response?.status);
    console.error('Response data:', error.response?.data);
    throw error;
  }
};

export const loginUser = async (email, password, userType) => {
  try {
    console.log('Logging in user:', { email, userType });
    const response = await apiClient.post('/api/users/login', { email, password, userType });
    console.log('Login successful:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error during login:', error);
    console.error('Response status:', error.response?.status);
    console.error('Response data:', error.response?.data);
    throw error;
  }
};

// Donation APIs
export const getDonations = async () => {
  try {
    const response = await apiClient.get('/api/donations');
    return response.data;
  } catch (error) {
    console.error('Error fetching donations:', error);
    throw error;
  }
};

export const getUserDonations = async (userId) => {
  try {
    const response = await apiClient.get(`/api/donations/donor/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching user donations:', error);
    throw error;
  }
};

export const getNearbyDonations = async (userId) => {
  try {
    const response = await apiClient.get(`/api/donations/nearby/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching nearby donations:', error);
    throw error;
  }
};

export const createDonation = async (donationData) => {
  try {
    console.log('Sending donation data:', donationData);
    const response = await apiClient.post('/api/donations', donationData);
    console.log('Donation created successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error creating donation:', error);
    console.error('Response status:', error.response?.status);
    console.error('Response data:', error.response?.data);
    throw error;
  }
};

export const claimDonation = async (donationId, userId) => {
  try {
    const response = await apiClient.put(`/api/donations/${donationId}/claim`, { userId });
    console.log('Donation claimed successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error claiming donation:', error);
    throw error;
  }
};

// Test backend connectivity
export const testBackendConnection = async () => {
  try {
    const response = await apiClient.get('/');
    return response.data;
  } catch (error) {
    console.error('Backend connection test failed:', error);
    throw error;
  }
};
