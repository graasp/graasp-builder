import { Stack } from '@mui/material';

import { DiscriminatedItem } from '@graasp/sdk';

import BookmarkButton from '../common/BookmarkButton';
import DownloadButton from '../main/DownloadButton';

type Props = {
  data: DiscriminatedItem;
};

// items and memberships match by index
const ItemActions = ({ data: item }: Props): JSX.Element => (
  <Stack direction="row" justifyContent="center" alignItems="center">
    <BookmarkButton size="medium" key="bookmark" item={item} />
    <DownloadButton item={item} />
  </Stack>
);

export default ItemActions;
