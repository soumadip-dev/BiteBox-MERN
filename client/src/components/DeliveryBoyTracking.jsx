import React from 'react';
import scotter from '../assets/scooter.png';
import home from '../assets/home.png';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapContainer, Marker, Polyline, Popup, TileLayer } from 'react-leaflet';

const deliveryBoyIcon = new L.Icon({
  iconUrl: scotter,
  iconSize: [40, 40],
  iconAnchor: [20, 40],
});

const customerIcon = new L.Icon({
  iconUrl: home,
  iconSize: [40, 40],
  iconAnchor: [20, 40],
});

const DeliveryBoyTracking = ({ data }) => {
  const deliveryBoyLat = data.deliveryBoyLocation.lat;
  const deliveryBoyLon = data.deliveryBoyLocation.lon;

  const customerLat = data.customerLocation.lat;
  const customerLon = data.customerLocation.lon;

  const path = [
    [deliveryBoyLat, deliveryBoyLon],
    [customerLat, customerLon],
  ];

  const center = [deliveryBoyLat, deliveryBoyLon];

  return (
    <div className="rounded-xl border border-gray-200 overflow-hidden shadow-inner">
      <div className="h-49 sm:h-71 w-full">
        <MapContainer className={'w-full h-full rounded-lg'} center={center} zoom={16}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          <Marker position={[deliveryBoyLat, deliveryBoyLon]} icon={deliveryBoyIcon}>
            <Popup>
              <div className="font-semibold text-sm">Delivery Partner</div>
              <div className="text-xs">Your current location</div>
            </Popup>
          </Marker>
          <Marker position={[customerLat, customerLon]} icon={customerIcon}>
            <Popup>
              <div className="font-semibold text-sm">Customer Location</div>
              <div className="text-xs">Delivery destination</div>
            </Popup>
          </Marker>
          <Polyline positions={path} color="#ff4d2d" weight={3} opacity={0.7} />
        </MapContainer>
      </div>
    </div>
  );
};

export default DeliveryBoyTracking;
