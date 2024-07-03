import { useEffect, useState } from 'react';

import { Skeleton, Stack, Typography } from '@mui/material';

import { Map } from '@graasp/map';
import { type DiscriminatedItem, ItemGeolocation } from '@graasp/sdk';
import { useMobileView } from '@graasp/ui';

import { hooks, mutations } from '@/config/queryClient';

import { buildMapViewId } from '../../config/selectors';
import NewItemModal from '../main/NewItemModal';

type Props = {
  parentId?: DiscriminatedItem['id'];
  title?: string;
  height?: string;
  viewItem: (item: DiscriminatedItem) => void;
  viewItemInBuilder: (item: DiscriminatedItem) => void;
  enableGeolocation?: boolean;
};

const options = {
  enableHighAccuracy: true,
  timeout: 5000,
  maximumAge: 0,
};

const useCurrentLocation = (enableGeolocation = true) => {
  const [hasFetchedCurrentLocation, setHasFetchedCurrentLocation] =
    useState(false);

  const [currentPosition, setCurrentPosition] = useState<{
    lat: number;
    lng: number;
  }>();

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
    console.log(getCurrentPosition());
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

const MapView = ({
  parentId,
  title,
  height = '100vh',
  viewItem,
  viewItemInBuilder,
  enableGeolocation = true,
}: Props): JSX.Element => {
  const { data: currentMember } = hooks.useCurrentMember();
  const { isMobile } = useMobileView();
  const [geolocation, setGeolocation] = useState<Partial<ItemGeolocation>>();
  const [open, setOpen] = useState(false);
  const { data: parent, isLoading: isLoadingParent } = hooks.useItem(parentId);
  const { hasFetchedCurrentLocation, currentPosition } =
    useCurrentLocation(enableGeolocation);

  const handleAddOnClick = (args: { location: Partial<ItemGeolocation> }) => {
    setGeolocation(args.location);
    setOpen(true);
  };

  const handleClose = () => {
    setGeolocation(undefined);
    setOpen(false);
  };

  return (
    <>
      <Stack height={height}>
        <Stack>
          {title && (
            <Typography variant="h4" sx={{ wordWrap: 'break-word' }}>
              {title}
            </Typography>
          )}
        </Stack>
        <Stack flex={1}>
          {(parentId && isLoadingParent) ||
          (enableGeolocation && !hasFetchedCurrentLocation) ? (
            <Skeleton width="100%" height="100%" />
          ) : (
            <div
              id={buildMapViewId(parentId)}
              style={{ width: '100%', height: '100%' }}
            >
              <Map
                currentPosition={currentPosition}
                useDeleteItemGeolocation={mutations.useDeleteItemGeolocation}
                usePostItem={mutations.usePostItem}
                useRecycleItems={mutations.useRecycleItems}
                useAddressFromGeolocation={hooks.useAddressFromGeolocation}
                useSuggestionsForAddress={hooks.useSuggestionsForAddress}
                useItemsInMap={hooks.useItemsInMap}
                viewItem={viewItem}
                viewItemInBuilder={viewItemInBuilder}
                currentMember={currentMember}
                item={parent}
                // use builder modal to add new item if the screen is big enough
                // todo: always use builder modal when it is responsive
                handleAddOnClick={isMobile ? undefined : handleAddOnClick}
              />
            </div>
          )}
        </Stack>
      </Stack>
      {!isMobile && (
        <NewItemModal
          open={open}
          handleClose={handleClose}
          geolocation={geolocation}
        />
      )}
    </>
  );
};

export default MapView;
