import Stack from '@mui/material/Stack';

import { useMatch } from 'react-router';

import { Loader } from '@graasp/ui';

import { buildItemPath } from '../../../config/paths';
import { hooks } from '../../../config/queryClient';
import { ITEM_HEADER_ID } from '../../../config/selectors';
import Navigation from '../../layout/Navigation';
import ItemHeaderActions from './ItemHeaderActions';

const { useItem } = hooks;

type Props = {
  showNavigation?: boolean;
};

const ItemHeader = ({ showNavigation = true }: Props): JSX.Element => {
  const match = useMatch(buildItemPath());
  const itemId = match?.params?.itemId;
  const { data: item, isLoading: isItemLoading } = useItem(itemId);

  if (isItemLoading) {
    return <Loader />;
  }

  return (
    <Stack
      direction="row"
      justifyContent="space-between"
      alignItems="center"
      mb={1}
      id={ITEM_HEADER_ID}
    >
      {/* display empty div to render actions on the right */}
      {showNavigation ? <Navigation /> : <div />}
      <ItemHeaderActions item={item} />
    </Stack>
  );
};

export default ItemHeader;
