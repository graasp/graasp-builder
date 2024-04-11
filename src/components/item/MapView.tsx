import { Stack, Typography } from '@mui/material';

import { Map } from '@graasp/map';
import { type DiscriminatedItem, redirect } from '@graasp/sdk';

import { buildGraaspPlayerView } from '@/config/externalPaths';
import { hooks, mutations } from '@/config/queryClient';
import { buildPlayerTabName } from '@/config/selectors';

type Props = {
  parentId?: DiscriminatedItem['id'];
  title?: string;
  height?: string;
};

const MapView = ({ parentId, title, height = '100vh' }: Props): JSX.Element => {
  const { data: currentMember } = hooks.useCurrentMember();

  return (
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
          />
        </div>
      </Stack>
    </Stack>
  );
};

export default MapView;
