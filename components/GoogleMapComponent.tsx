// components/GoogleMapComponent.tsx

import React from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

interface GoogleMapComponentProps {
  lat: number;
  lng: number;
  zoom: number;
}

const containerStyle = {
  width: '100%',
  height: '300px'
};

const GoogleMapComponent: React.FC<GoogleMapComponentProps> = ({ lat, lng, zoom }) => {
  const center = {
    lat: lat,
    lng: lng
  };

  return (
    <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ''}>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={zoom}
      >
        <Marker position={center} />
      </GoogleMap>
    </LoadScript>
  );
};

export default GoogleMapComponent;
