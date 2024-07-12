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
  enableGeolocation = true,
): {
  hasFetchedCurrentLocation: boolean;
  currentPosition?: CurrentPosition;
} => {
  const [hasFetchedCurrentLocation, setHasFetchedCurrentLocation] =
    useState(false);

  const [currentPosition, setCurrentPosition] = useState<CurrentPosition>();

  const getCurrentPosition = () => {
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
  };

  // get current location
  useEffect(() => {
    if (enableGeolocation) {
      if (navigator.permissions) {
        // check permissions
        // https://developer.mozilla.org/en-US/docs/Web/API/Navigator/permissions#examples
        navigator.permissions
          .query({ name: 'geolocation' })
          .then(({ state }) => {
            if (state === 'denied') {
              console.error('geolocation denied:', state);
              setHasFetchedCurrentLocation(true);
            }
            // allows granted and prompt values (safari)
            else {
              getCurrentPosition();
            }
          })
          .catch((e) => {
            console.error('geolocation denied:', e);
            setHasFetchedCurrentLocation(true);
          });
      } else {
        // navigator.permissions does not exist in safari
        // still try to get position for webview's ios
        getCurrentPosition();
      }
    }
  }, [enableGeolocation]);

  return { hasFetchedCurrentLocation, currentPosition };
};
