import { useState, useEffect } from 'react';
// import GetLocation from 'react-native-get-location';

const useGeoLocation = () => {
    const [location, setLocation] = useState({
        latitude: null,
        longitude: null,
    });
    const [error, setError] = useState(null);

    const fetchLocation = async () => {
            try {
                // const currentLocation = await GetLocation.getCurrentPosition({
                //     enableHighAccuracy: true,
                //     timeout: 60000,
                // });
                // setLocation({
                //     latitude: currentLocation.latitude,
                //     longitude: currentLocation.longitude,
                // });

                // console.log(error, 'successssssss', currentLocation.latitude, currentLocation.longitude);
            } catch (err) {
                console.log(err.message, 'errorerrore');
                setError(err.message);
            }
        };

    useEffect(() => {
        // console.log(error, 'errorerrorerrorerrorerrorerrore', location, error);
        fetchLocation();
    }, []);

    return { location, error, fetchLocation };
};

export default useGeoLocation;
