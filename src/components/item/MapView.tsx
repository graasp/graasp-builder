import { Typography } from '@mui/material';

import { Map } from '@graasp/map';
import { type DiscriminatedItem, redirect } from '@graasp/sdk';

import { buildGraaspPlayerView } from '@/config/externalPaths';
import { hooks, mutations } from '@/config/queryClient';
import { buildPlayerTabName } from '@/config/selectors';

type Props = {
  parentId?: DiscriminatedItem['id'];
  title: string;
};

const MapView = ({ parentId, title }: Props): JSX.Element => {
  const { data: currentMember } = hooks.useCurrentMember();

  return (
    <>
      <Typography variant="h4" sx={{ wordWrap: 'break-word' }}>
        {title}
      </Typography>
      <div style={{ width: '100%', height: '80vh' }}>
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
    </>
  );
};

export default MapView;
