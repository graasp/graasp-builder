import { useEffect, useState } from 'react';

const options = {
  enableHighAccuracy: true,
  timeout: 5000,
  maximumAge: 0,
};

type CurrentPosition = {
  lat: number;
  lng: number;
};

export const useCurrentLocation = (
  enableGeolocation = false,
): {
  hasFetchedCurrentLocation: boolean;
  currentPosition?: CurrentPosition;
} => {
  const [hasFetchedCurrentLocation, setHasFetchedCurrentLocation] =
    useState(false);

  const [currentPosition, setCurrentPosition] = useState<CurrentPosition>();

  // get current location
  useEffect(() => {
    if (enableGeolocation) {
      // https://developer.mozilla.org/en-US/docs/Web/API/Navigator/permissions#examples
      if (!navigator.permissions) {
        setHasFetchedCurrentLocation(true);
      } else {
        navigator.permissions
          .query({ name: 'geolocation' })
          .then(({ state }) => {
            if (state === 'granted') {
              const success = (pos: {
                coords: { latitude: number; longitude: number };
              }) => {
                const crd = pos.coords;
                setCurrentPosition({ lat: crd.latitude, lng: crd.longitude });
                setHasFetchedCurrentLocation(true);
              };

              navigator.geolocation.getCurrentPosition(
                success,
                (err: { code: number; message: string }) => {
                  // eslint-disable-next-line no-console
                  console.warn(`ERROR(${err.code}): ${err.message}`);
                  setHasFetchedCurrentLocation(true);
                },
                options,
              );
            } else {
              console.error('geolocation denied:', state);
              setHasFetchedCurrentLocation(true);
            }
          })
          .catch((e) => {
            console.error('geolocation denied:', e);
            setHasFetchedCurrentLocation(true);
          });
      }
    }
  }, [enableGeolocation]);

  return { hasFetchedCurrentLocation, currentPosition };
};
