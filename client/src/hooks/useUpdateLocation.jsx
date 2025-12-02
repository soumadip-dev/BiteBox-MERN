import { useSelector } from 'react-redux';
import { useEffect } from 'react';
import { updateUserLocation } from '../api/userApi.js';

const useUpdateLocation = () => {
  const { userData } = useSelector(state => state.user);

  useEffect(() => {
    if (!userData) return;

    let watchId;

    const updateLocation = async (latitude, longitude) => {
      try {
        await updateUserLocation(latitude, longitude);
      } catch (err) {
        console.error('Location update failed:', err);
      }
    };

    if (navigator.geolocation) {
      watchId = navigator.geolocation.watchPosition(
        position => {
          const { latitude, longitude } = position.coords;
          updateLocation(latitude, longitude);
        },
        error => {
          console.error('Error getting location:', error);
        }
      );
    }

    return () => {
      if (watchId) navigator.geolocation.clearWatch(watchId);
    };
  }, [userData]);
};

export default useUpdateLocation;
