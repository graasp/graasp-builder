import { Typography } from '@mui/material';

import { Map } from '@graasp/map';
import { DiscriminatedItem } from '@graasp/sdk';

import { hooks, mutations } from '@/config/queryClient';

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
          viewItem={() => {
            // eslint-disable-next-line no-console
            console.log('view item');
          }}
          currentMember={currentMember}
          itemId={parentId}
        />
      </div>
    </>
  );
};

export default MapView;
