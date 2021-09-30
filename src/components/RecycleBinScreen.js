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
import { ITEMS_TABLE_DELETE_SELECTED_ITEMS_ID } from '../config/selectors';

const RowActions = ({ data: item }) => (
  <>
    <RestoreButton itemId={item.id} />
    <DeleteButton itemIds={[item.id]} />
  </>
);
RowActions.propTypes = {
  data: PropTypes.shape({}).isRequired,
};

const ToolbarActions = ({ selectedIds }) => (
  <>
    <RestoreButton itemIds={selectedIds} color="secondary" />
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
        title={t('Deleted Items')}
        items={List(items)}
        actions={RowActions}
        toolbarActions={ToolbarActions}
      />
    </Main>
  );
};

export default RecycleBinScreen;
