import { useState, useEffect } from 'react';
import GetLocation from 'react-native-get-location';

const useGeoLocation = () => {
    const [location, setLocation] = useState({
        latitude: null,
        longitude: null,
    });
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchLocation = async () => {
            try {
                const currentLocation = await GetLocation.getCurrentPosition({
                    enableHighAccuracy: true,
                    timeout: 60000,
                });
                setLocation({
                    latitude: currentLocation.latitude,
                    longitude: currentLocation.longitude,
                });
            } catch (err) {
                setError(err.message);
            }
        };

        fetchLocation();
    }, []);

    return { location, error };
};

export default useGeoLocation;
