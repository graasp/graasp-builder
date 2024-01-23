import Stack from '@mui/material/Stack';

import { Loader, useMobileView, useShortenURLParams } from '@graasp/ui';

import { ITEM_ID_PARAMS } from '@/config/paths';

import { hooks } from '../../../config/queryClient';
import { ITEM_HEADER_ID } from '../../../config/selectors';
import ErrorAlert from '../../common/ErrorAlert';
import Navigation from '../../layout/Navigation';
import ItemHeaderActions from './ItemHeaderActions';
import MobileItemHeaderActions from './MobileItemHeaderActions';

const { useItem } = hooks;

type Props = {
  showNavigation?: boolean;
};

const ItemHeader = ({ showNavigation = true }: Props): JSX.Element => {
  const itemId = useShortenURLParams(ITEM_ID_PARAMS);
  const { data: item, isLoading: isItemLoading, isError } = useItem(itemId);

  const { isMobile } = useMobileView();

  if (isItemLoading) {
    return <Loader />;
  }

  if (isError) {
    return <ErrorAlert />;
  }

  return (
    <Stack
      direction="row"
      alignItems="center"
      justifyContent="space-between"
      mb={3}
      mt={2}
      id={ITEM_HEADER_ID}
    >
      {/* display empty div to render actions on the right */}
      {showNavigation ? <Navigation /> : <div />}
      {isMobile ? (
        <MobileItemHeaderActions item={item} />
      ) : (
        <ItemHeaderActions item={item} />
      )}
    </Stack>
  );
};

export default ItemHeader;
