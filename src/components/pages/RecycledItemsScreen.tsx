import { Helmet } from 'react-helmet';

import { Box } from '@mui/material';

import { Loader } from '@graasp/ui';

import { useBuilderTranslation } from '../../config/i18n';
import { hooks } from '../../config/queryClient';
import {
  ITEMS_TABLE_DELETE_SELECTED_ITEMS_ID,
  ITEMS_TABLE_RESTORE_SELECTED_ITEMS_ID,
  RECYCLED_ITEMS_ERROR_ALERT_ID,
  RECYCLED_ITEMS_ID,
  RECYCLED_ITEMS_ROOT_CONTAINER,
} from '../../config/selectors';
import { BUILDER } from '../../langs/constants';
import DeleteButton from '../common/DeleteButton';
import ErrorAlert from '../common/ErrorAlert';
import RestoreButton from '../common/RestoreButton';
import { useFilterItemsContext } from '../context/FilterItemsContext';
import ItemHeader from '../item/header/ItemHeader';
import Items from '../main/Items';

type RowActionsProps = {
  data: { id: string };
};

const RowActions = ({ data: item }: RowActionsProps): JSX.Element => (
  <>
    <RestoreButton itemIds={[item.id]} />
    <DeleteButton itemIds={[item.id]} />
  </>
);

type ToolbarActionsProps = {
  selectedIds: string[];
};

const ToolbarActions = ({ selectedIds }: ToolbarActionsProps): JSX.Element => (
  <>
    <RestoreButton
      itemIds={selectedIds}
      color="secondary"
      id={ITEMS_TABLE_RESTORE_SELECTED_ITEMS_ID}
    />
    <DeleteButton
      id={ITEMS_TABLE_DELETE_SELECTED_ITEMS_ID}
      itemIds={selectedIds}
      color="secondary"
    />
  </>
);

const RecycleBinLoadableContent = (): JSX.Element | null => {
  const { t: translateBuilder } = useBuilderTranslation();
  const { data: recycledItems, isLoading, isError } = hooks.useRecycledItems();
  const { shouldDisplayItem } = useFilterItemsContext();
  // TODO: implement filter in the hooks directly ?
  const filteredData = recycledItems?.filter((d) => shouldDisplayItem(d.type));

  if (filteredData) {
    return (
      <>
        <Helmet>
          <title>{translateBuilder(BUILDER.RECYCLE_BIN_TITLE)}</title>
        </Helmet>
        <Box id={RECYCLED_ITEMS_ROOT_CONTAINER} m={2}>
          <ItemHeader showNavigation={false} />
          <Items
            id={RECYCLED_ITEMS_ID}
            clickable={false}
            title={translateBuilder(BUILDER.RECYCLE_BIN_TITLE)}
            items={filteredData}
            actions={RowActions}
            ToolbarActions={ToolbarActions}
            showThumbnails={false}
            enableMemberships={false}
            totalCount={recycledItems?.length}
          />
        </Box>
      </>
    );
  }

  if (isLoading) {
    return <Loader />;
  }

  if (isError) {
    return <ErrorAlert id={RECYCLED_ITEMS_ERROR_ALERT_ID} />;
  }

  return null;
};

const RecycledItemsScreen = (): JSX.Element => <RecycleBinLoadableContent />;

export default RecycledItemsScreen;
