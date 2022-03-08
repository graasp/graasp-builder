import React from 'react';
import { List } from 'immutable';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import ItemHeader from './item/header/ItemHeader';
import ErrorAlert from './common/ErrorAlert';
import Items from './main/Items';
import { hooks } from '../config/queryClient';
import Loader from './common/Loader';
import Main from './main/Main';
import DeleteButton from './common/DeleteButton';
import RestoreButton from './common/RestoreButton';
import {
  ITEMS_TABLE_DELETE_SELECTED_ITEMS_ID,
  ITEMS_TABLE_RESTORE_SELECTED_ITEMS_ID,
} from '../config/selectors';
import Authorization from './common/Authorization';

const RowActions = ({ data: item }) => (
  <>
    <RestoreButton itemIds={[item.id]} />
    <DeleteButton itemIds={[item.id]} />
  </>
);
RowActions.propTypes = {
  data: PropTypes.shape({
    id: PropTypes.string.isRequired,
  }).isRequired,
};

const ToolbarActions = ({ selectedIds }) => (
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
ToolbarActions.propTypes = {
  selectedIds: PropTypes.arrayOf(PropTypes.string).isRequired,
};

const RecycleBinScreen = () => {
  const { t } = useTranslation();
  const { data: items, isLoading, isError } = hooks.useRecycledItems();

  if (isError) {
    return <ErrorAlert />;
  }

  if (isLoading) {
    return <Loader />;
  }

  return (
    <Main>
      <ItemHeader />
      <Items
        clickable={false}
        title={t('Deleted Items')}
        items={List(items)}
        actions={RowActions}
        toolbarActions={ToolbarActions}
        showThumbnails={false}
      />
    </Main>
  );
};

export default Authorization()(RecycleBinScreen);
