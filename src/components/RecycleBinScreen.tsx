import { List } from 'immutable';

import { Box } from '@mui/material';

import { FC } from 'react';

import { BUILDER } from '@graasp/translations';
import { Loader } from '@graasp/ui';

import { useBuilderTranslation } from '../config/i18n';
import { hooks } from '../config/queryClient';
import {
  ITEMS_TABLE_DELETE_SELECTED_ITEMS_ID,
  ITEMS_TABLE_RESTORE_SELECTED_ITEMS_ID,
} from '../config/selectors';
import DeleteButton from './common/DeleteButton';
import ErrorAlert from './common/ErrorAlert';
import RestoreButton from './common/RestoreButton';
import ItemHeader from './item/header/ItemHeader';
import Items from './main/Items';
import Main from './main/Main';

type RowActionsProps = {
  data: { id: string };
};

const RowActions: FC<RowActionsProps> = ({
  data: item,
}: {
  data: { id: string };
}) => (
  <>
    <RestoreButton itemIds={[item.id]} />
    <DeleteButton itemIds={[item.id]} />
  </>
);

type ToolbarActionsProps = {
  selectedIds: string[];
};

const ToolbarActions: FC<ToolbarActionsProps> = ({
  selectedIds,
}: {
  selectedIds: string[];
}) => (
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

const RecycleBinScreen: FC = () => {
  const { t } = useBuilderTranslation();
  const { data: items, isLoading, isError } = hooks.useRecycledItems();

  if (isError) {
    return <ErrorAlert />;
  }

  if (isLoading) {
    return <Loader />;
  }

  return (
    <Main>
      <Box mx={2}>
        <ItemHeader showNavigation={false} />
        <Items
          clickable={false}
          title={t(BUILDER.RECYCLE_BIN_TITLE)}
          items={List(items)}
          actions={RowActions}
          ToolbarActions={ToolbarActions}
          showThumbnails={false}
          enableMemberships={false}
        />
      </Box>
    </Main>
  );
};

export default RecycleBinScreen;
