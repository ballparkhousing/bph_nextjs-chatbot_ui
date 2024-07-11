import React, { useCallback, useRef, useState } from 'react';
import { GoogleMap, LoadScript, Marker, DrawingManager, Polygon } from '@react-google-maps/api';

interface GoogleMapComponentProps {
  lat: number;
  lng: number;
  zoom: number;
  onShapeComplete: (shape: any) => void;
  polygonCoords?: google.maps.LatLngLiteral[][];
}

const containerStyle = {
  width: '100%',
  height: '300px'
};

const GoogleMapComponent: React.FC<GoogleMapComponentProps> = ({ lat, lng, zoom, onShapeComplete, polygonCoords }) => {
  const mapRef = useRef<google.maps.Map | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [drawnShapes, setDrawnShapes] = useState<any[]>([]);

  const onLoad = useCallback((map) => {
    mapRef.current = map;
    setMapLoaded(true);
  }, []);

  const onUnmount = useCallback(() => {
    mapRef.current = null;
    setMapLoaded(false);
  }, []);

  const handleOverlayComplete = (event: google.maps.drawing.OverlayCompleteEvent) => {
    if (event.type === google.maps.drawing.OverlayType.RECTANGLE) {
      const bounds = (event.overlay as google.maps.Rectangle).getBounds();
      console.log('Rectangle Bounds:', bounds);
      setDrawnShapes(prevShapes => [...prevShapes, { type: 'rectangle', bounds }]);
      onShapeComplete(bounds);
    } else if (event.type === google.maps.drawing.OverlayType.CIRCLE) {
      const center = (event.overlay as google.maps.Circle).getCenter();
      const radius = (event.overlay as google.maps.Circle).getRadius();
      console.log('Circle Center:', center);
      console.log('Circle Radius:', radius);
      setDrawnShapes(prevShapes => [...prevShapes, { type: 'circle', center, radius }]);
      onShapeComplete({ center, radius });
    }
  };

  return (
    <LoadScript
      googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ''}
      libraries={['drawing']}
    >
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
            {polygonCoords && polygonCoords.map((coords, index) => (
              <Polygon
                key={index}
                paths={coords}
                options={{
                  fillColor: '#00FF00',
                  fillOpacity: 0.4,
                  strokeColor: '#0000FF',
                  strokeOpacity: 1,
                  strokeWeight: 2,
                  clickable: true,
                  draggable: false,
                  editable: false,
                  geodesic: false,
                  zIndex: 1,
                }}
              />
            ))}

            <DrawingManager
              onOverlayComplete={handleOverlayComplete}
              options={{
                drawingControl: true,
                drawingControlOptions: {
                  position: google.maps.ControlPosition.TOP_CENTER,
                  drawingModes: ['rectangle', 'circle'],
                },
                rectangleOptions: {
                  fillColor: '#ffff00',
                  fillOpacity: 0.5,
                  strokeWeight: 2,
                  clickable: true,
                  editable: true,
                  zIndex: 1,
                },
                circleOptions: {
                  fillColor: '#ffff00',
                  fillOpacity: 0.5,
                  strokeWeight: 2,
                  clickable: true,
                  editable: true,
                  zIndex: 1,
                },
              }}
            />
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
      </GoogleMap>
    </LoadScript>
  );
};

export default GoogleMapComponent;
