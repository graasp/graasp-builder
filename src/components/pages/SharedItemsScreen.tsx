import { Alert } from '@mui/material';
import Box from '@mui/material/Box';

import { Loader } from '@graasp/ui';

import { BUILDER } from '@/langs/constants';

import { useBuilderTranslation } from '../../config/i18n';
import { hooks } from '../../config/queryClient';
import {
  SHARED_ITEMS_ERROR_ALERT_ID,
  SHARED_ITEMS_ID,
  SHARED_ITEMS_ROOT_CONTAINER,
} from '../../config/selectors';
import ErrorAlert from '../common/ErrorAlert';
import { useFilterItemsContext } from '../context/FilterItemsContext';
import ItemHeader from '../item/header/ItemHeader';
import Items from '../main/Items';

const SharedItemsLoadableContent = (): JSX.Element | null => {
  const { t: translateBuilder } = useBuilderTranslation();
  const { data: sharedItems, isLoading, isError } = hooks.useSharedItems();
  const { displayItem } = useFilterItemsContext();
  // TODO: implement filter in the hooks directly ?
  const filteredItems = sharedItems?.filter((i) => displayItem(i.type));

  if (filteredItems) {
    return (
      <Box id={SHARED_ITEMS_ROOT_CONTAINER} mx={2}>
        <Alert severity="warning" sx={{ mt: 3 }}>
          {translateBuilder(
            "You can also find the items of this page in ''My Graasp''. This page will be unavailable soon.",
          )}
        </Alert>
        <ItemHeader showNavigation={false} />
        <Items
          id={SHARED_ITEMS_ID}
          title={translateBuilder(BUILDER.SHARED_ITEMS_TITLE)}
          items={filteredItems}
          canMove={false}
          totalCount={filteredItems?.length}
        />
      </Box>
    );
  }
  if (isError) {
    return <ErrorAlert id={SHARED_ITEMS_ERROR_ALERT_ID} />;
  }

  if (isLoading) {
    return <Loader />;
  }

  return null;
};

const SharedItemsScreen = (): JSX.Element => <SharedItemsLoadableContent />;

export default SharedItemsScreen;
