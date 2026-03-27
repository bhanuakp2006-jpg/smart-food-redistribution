import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapPin } from 'lucide-react';

// Fix for leaflet marker icons in Vite
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const MapClickHandler = ({ onLocationSelect }) => {
  useMapEvents({
    click(e) {
      onLocationSelect({
        latitude: e.latlng.lat,
        longitude: e.latlng.lng
      });
    }
  });
  return null;
};

export default function MapPicker({ onLocationSelect, initialLocation }) {
  const [position, setPosition] = useState(initialLocation || [28.6139, 77.2090]); // Default to Delhi
  const [address, setAddress] = useState('');
  const [mapReady, setMapReady] = useState(false);

  useEffect(() => {
    // Try to get user's current location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        setPosition([latitude, longitude]);
        onLocationSelect && onLocationSelect({
          latitude,
          longitude,
          address: `Lat: ${latitude.toFixed(4)}, Lng: ${longitude.toFixed(4)}`
        });
      }, (error) => {
        console.log('Location access denied, using default:', error);
        setMapReady(true);
      });
    } else {
      setMapReady(true);
    }
  }, [onLocationSelect]);

  const handleLocationSelect = (coords) => {
    setPosition([coords.latitude, coords.longitude]);
    onLocationSelect && onLocationSelect({
      ...coords,
      address: address || `Lat: ${coords.latitude.toFixed(4)}, Lng: ${coords.longitude.toFixed(4)}`
    });
  };

  const handleAddressChange = (e) => {
    const newAddress = e.target.value;
    setAddress(newAddress);
  };

  if (!mapReady && !initialLocation) {
    return (
      <div className="w-full h-64 bg-gray-100 rounded-lg flex items-center justify-center">
        <div className="text-center">
          <MapPin className="w-8 h-8 text-gray-400 mx-auto mb-2" />
          <p className="text-gray-600">Loading map...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <label className="block text-gray-700 font-semibold mb-2">Select Location on Map</label>
      <div className="mb-3">
        <input
          type="text"
          placeholder="Enter address or click on map"
          value={address}
          onChange={handleAddressChange}
          className="w-full border-2 border-gray-300 rounded-lg px-3 py-2 text-gray-700 focus:outline-none focus:border-green-500"
        />
      </div>
      <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
        <MapPin size={16} />
        <span>Click on the map to select your location</span>
      </div>
      <div className="rounded-lg border-2 border-gray-300 overflow-hidden">
        <MapContainer
          center={position}
          zoom={13}
          style={{ height: '400px', width: '100%' }}
          className="z-0"
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          {position && (
            <Marker position={position}>
              <Popup>
                {address || `Lat: ${position[0].toFixed(4)}, Lng: ${position[1].toFixed(4)}`}
              </Popup>
            </Marker>
          )}
          <MapClickHandler onLocationSelect={handleLocationSelect} />
        </MapContainer>
      </div>
    </div>
  );
}
