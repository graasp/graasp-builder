import { Box } from '@mui/material';

import { Loader } from '@graasp/ui';

import { List } from 'immutable';

import { useBuilderTranslation } from '../config/i18n';
import { hooks } from '../config/queryClient';
import {
  ITEMS_TABLE_DELETE_SELECTED_ITEMS_ID,
  ITEMS_TABLE_RESTORE_SELECTED_ITEMS_ID,
  RECYCLED_ITEMS_ID,
} from '../config/selectors';
import { BUILDER } from '../langs/constants';
import DeleteButton from './common/DeleteButton';
import ErrorAlert from './common/ErrorAlert';
import RestoreButton from './common/RestoreButton';
import ItemHeader from './item/header/ItemHeader';
import Items from './main/Items';
import Main from './main/Main';

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

const RecycleBinLoadableContent = (): JSX.Element => {
  const { t: translateBuilder } = useBuilderTranslation();
  const { data: recycledItems, isLoading, isError } = hooks.useRecycledItems();
  if (isError) {
    return <ErrorAlert />;
  }

  if (isLoading) {
    return <Loader />;
  }

  return (
    <Box mx={2}>
      <ItemHeader showNavigation={false} />
      <Items
        id={RECYCLED_ITEMS_ID}
        clickable={false}
        title={translateBuilder(BUILDER.RECYCLE_BIN_TITLE)}
        items={recycledItems ?? List()}
        actions={RowActions}
        ToolbarActions={ToolbarActions}
        showThumbnails={false}
        enableMemberships={false}
      />
    </Box>
  );
};

const RecycleBinScreen = (): JSX.Element => (
  <Main>
    <RecycleBinLoadableContent />
  </Main>
);

export default RecycleBinScreen;
