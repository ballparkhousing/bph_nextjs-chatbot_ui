import React, { useCallback, useRef, useState, useEffect } from 'react';
import { GoogleMap, useJsApiLoader, Marker, DrawingManager } from '@react-google-maps/api';

interface GoogleMapComponentProps {
  lat: number;
  lng: number;
  zoom: number;
  onShapeComplete: (shape: any) => void;
  polygonCoords?: Array<{ lat: number; lng: number }> | null; // Update the type of polygonCoords
}

const containerStyle = {
  width: '100%',
  height: '300px'
};

const GoogleMapComponent: React.FC<GoogleMapComponentProps> = ({ lat, lng, zoom, onShapeComplete, polygonCoords }) => {
  const mapRef = useRef<google.maps.Map | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [drawnShapes, setDrawnShapes] = useState<any[]>([]);
  const [googleMapsApi, setGoogleMapsApi] = useState<typeof google | null>(null);
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-api',
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
    libraries: ['drawing']
  })

  const onLoad = useCallback((map: google.maps.Map) => {
    mapRef.current = map;
    setMapLoaded(true);
    setGoogleMapsApi(window.google); // Ensure google is set when map is loaded
  }, []);

  const onUnmount = useCallback(() => {
    mapRef.current = null;
    setMapLoaded(false);
  }, []);

  const handleOverlayComplete = (event: google.maps.drawing.OverlayCompleteEvent) => {
    if (event.type === google.maps.drawing.OverlayType.RECTANGLE) {
      const bounds = (event.overlay as google.maps.Rectangle).getBounds();
      setDrawnShapes(prevShapes => [...prevShapes, { type: 'rectangle', bounds }]);
      onShapeComplete(bounds);
    } else if (event.type === google.maps.drawing.OverlayType.CIRCLE) {
      const center = (event.overlay as google.maps.Circle).getCenter();
      const radius = (event.overlay as google.maps.Circle).getRadius();
      setDrawnShapes(prevShapes => [...prevShapes, { type: 'circle', center, radius }]);
      onShapeComplete({ center, radius });
    }
  };

  if (isLoaded) {
    return (
      <GoogleMap
      mapContainerStyle={containerStyle}
      center={{ lat, lng }}
      zoom={zoom}
      onLoad={onLoad}
      onUnmount={onUnmount}
    >
      <Marker position={{ lat, lng }} />
      {mapLoaded && (
        <>
          {polygonCoords && polygonCoords.map((coord, index) => (
            <Marker
              key={index}
              position={coord}
            />
          ))}
        </>
      )}

      {drawnShapes.map((shape, index) => {
        if (shape.type === 'rectangle') {
          const bounds = shape.bounds;
          const ne = bounds.getNorthEast();
          const sw = bounds.getSouthWest();
          return (
            <React.Fragment key={index}>
              <Marker position={{ lat: ne.lat(), lng: ne.lng() }} />
              <Marker position={{ lat: sw.lat(), lng: sw.lng() }} />
            </React.Fragment>
          );
        } else if (shape.type === 'circle') {
          const center = shape.center;
          return (
            <Marker key={index} position={{ lat: center.lat(), lng: center.lng() }} />
          );
        }
        return null;
      })}

      {googleMapsApi && (
        <DrawingManager
          onOverlayComplete={handleOverlayComplete}
          options={{
            drawingControl: true,
            drawingControlOptions: {
              position: googleMapsApi.maps.ControlPosition.TOP_CENTER,
              drawingModes: [
                googleMapsApi.maps.drawing.OverlayType.CIRCLE,
                googleMapsApi.maps.drawing.OverlayType.RECTANGLE,
              ],
            },
          }}
        />
      )}
    </GoogleMap>
    )
  }
};

export default GoogleMapComponent;
