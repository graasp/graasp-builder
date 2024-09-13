import { Stack } from '@mui/material';

import { AccountType, DiscriminatedItem } from '@graasp/sdk';

import { hooks } from '@/config/queryClient';

import BookmarkButton from '../common/BookmarkButton';
import DownloadButton from '../main/DownloadButton';

type Props = {
  data: DiscriminatedItem;
};

// items and memberships match by index
const ItemActions = ({ data: item }: Props): JSX.Element => {
  const { data: currentMember } = hooks.useCurrentMember();

  return (
    <Stack direction="row" justifyContent="center" alignItems="center">
      {currentMember?.type === AccountType.Individual && (
        <BookmarkButton size="medium" key="bookmark" item={item} />
      )}
      <DownloadButton item={item} />
    </Stack>
  );
};

export default ItemActions;
