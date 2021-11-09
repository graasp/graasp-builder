import { List } from 'immutable';
import PropTypes from 'prop-types';
import { Loader } from '@graasp/ui';
import React, { useContext } from 'react';
import { ITEM_LAYOUT_MODES } from '../../enums';
import { LayoutContext } from '../context/LayoutContext';
import { useItemSearch } from '../item/ItemSearch';
import ItemsGrid from './ItemsGrid';
import { hooks } from '../../config/queryClient';
import ItemsTable from './ItemsTable';

const { useItemMemberships } = hooks;

const Items = ({
  items,
  title,
  id,
  headerElements,
  actions,
  toolbarActions,
  clickable,
  defautSortedColumn,
  isEditing,
  parentId,
}) => {
  const { mode } = useContext(LayoutContext);
  const itemSearch = useItemSearch(items);
  const {
    data: memberships,
    isLoading: isMembershipsLoading,
  } = useItemMemberships(
    itemSearch?.results?.map(({ id: itemId }) => itemId).toJS(),
  );

  if (isMembershipsLoading) {
    return <Loader />;
  }

  switch (mode) {
    case ITEM_LAYOUT_MODES.GRID:
      return (
        <ItemsGrid
          id={id}
          parentId={parentId}
          title={title}
          items={itemSearch.results}
          memberships={memberships}
          // This enables the possiblity to display messages (item is empty, no search result)
          itemSearch={itemSearch}
          headerElements={[itemSearch.input, ...headerElements]}
          clickable={clickable}
          isEditing={isEditing}
        />
      );
    case ITEM_LAYOUT_MODES.LIST:
    default:
      return (
        <ItemsTable
          defautSortedColumn={defautSortedColumn}
          id={id}
          tableTitle={title}
          items={itemSearch.results}
          memberships={memberships}
          headerElements={[itemSearch.input, ...headerElements]}
          isSearching={Boolean(itemSearch.text)}
          actions={actions}
          toolbarActions={toolbarActions}
          clickable={clickable}
          isEditing={isEditing}
        />
      );
  }
};

Items.propTypes = {
  items: PropTypes.instanceOf(List).isRequired,
  title: PropTypes.string.isRequired,
  id: PropTypes.string,
  headerElements: PropTypes.arrayOf(PropTypes.element),
  actions: PropTypes.element,
  toolbarActions: PropTypes.element,
  clickable: PropTypes.bool,
  defautSortedColumn: PropTypes.shape({
    updatedAt: PropTypes.string,
    createdAt: PropTypes.string,
    type: PropTypes.string,
    name: PropTypes.string,
  }),
  isEditing: PropTypes.bool,
  parentId: PropTypes.string,
};

Items.defaultProps = {
  id: null,
  headerElements: [],
  actions: null,
  toolbarActions: null,
  clickable: true,
  defautSortedColumn: {},
  isEditing: false,
  parentId: null,
};

export default Items;
