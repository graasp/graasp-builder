import { useState } from 'react';

import { Stack, Typography } from '@mui/material';

import { Map } from '@graasp/map';
import { type DiscriminatedItem, ItemGeolocation, redirect } from '@graasp/sdk';
import { useMobileView } from '@graasp/ui';

import { buildGraaspPlayerView } from '@/config/externalPaths';
import { hooks, mutations } from '@/config/queryClient';
import { buildPlayerTabName } from '@/config/selectors';

import NewItemModal from '../main/NewItemModal';

type Props = {
  parentId?: DiscriminatedItem['id'];
  title?: string;
  height?: string;
  isMobileApp?: boolean;
};

const MapView = ({
  isMobileApp = false,
  parentId,
  title,
  height = '100vh',
}: Props): JSX.Element => {
  const { data: currentMember } = hooks.useCurrentMember();
  const { isMobile } = useMobileView();
  const [geolocation, setGeolocation] = useState<Partial<ItemGeolocation>>();
  const [open, setOpen] = useState(false);

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
          <div style={{ width: '100%', height: '100%' }}>
            <Map
              isMobileApp={isMobileApp}
              useDeleteItemGeolocation={mutations.useDeleteItemGeolocation}
              usePostItem={mutations.usePostItem}
              useRecycleItems={mutations.useRecycleItems}
              useAddressFromGeolocation={hooks.useAddressFromGeolocation}
              useSuggestionsForAddress={hooks.useSuggestionsForAddress}
              useItemsInMap={hooks.useItemsInMap}
              viewItem={(item) => {
                redirect(window, buildGraaspPlayerView(item.id), {
                  name: buildPlayerTabName(item.id),
                  openInNewTab: true,
                });
              }}
              currentMember={currentMember}
              itemId={parentId}
              // use builder modal to add new item if the screen is big enough
              // todo: always use builder modal when it is responsive
              handleAddOnClick={isMobile ? undefined : handleAddOnClick}
            />
          </div>
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
