import { Stack } from '@mui/material';

import { DiscriminatedItem } from '@graasp/sdk';

import BookmarkButton from '../common/BookmarkButton';
import DownloadButton from '../main/DownloadButton';

type Props = {
  // manyMemberships?: ResultOf<ItemMembership[]>;
  // member?: Member | null;
  data: DiscriminatedItem;
};

// items and memberships match by index
const ActionsCellRenderer = ({ data: item }: Props): JSX.Element => (
  <Stack direction="row" justifyContent="center" alignItems="center">
    <BookmarkButton
      size="medium"
      key="bookmark"
      //   type={ActionButton.MENU_ITEM}
      item={item}
    />
    <DownloadButton id={item.id} name={item.name} />
  </Stack>
);

export default ActionsCellRenderer;
