import { List } from 'immutable';
import PropTypes from 'prop-types';
import React, { useContext } from 'react';
import { ITEM_LAYOUT_MODES } from '../../enums';
import { LayoutContext } from '../context/LayoutContext';
import { useItemSearch } from '../item/ItemSearch';
import ItemsGrid from './ItemsGrid';
import ItemsTable from './ItemsTable';

const Items = ({
  items,
  title,
  id,
  headerElements,
  actions,
  toolbarActions,
  clickable,
}) => {
  const { mode } = useContext(LayoutContext);
  const itemSearch = useItemSearch(items);

  switch (mode) {
    case ITEM_LAYOUT_MODES.GRID:
      return (
        <ItemsGrid
          id={id}
          title={title}
          items={itemSearch.results}
          // This enables the possiblity to display messages (item is empty, no search result)
          itemSearch={itemSearch}
          headerElements={[itemSearch.input, ...headerElements]}
          clickable={clickable}
        />
      );
    case ITEM_LAYOUT_MODES.LIST:
    default:
      return (
        <ItemsTable
          id={id}
          tableTitle={title}
          items={itemSearch.results}
          headerElements={[itemSearch.input, ...headerElements]}
          isSearching={Boolean(itemSearch.text)}
          actions={actions}
          toolbarActions={toolbarActions}
          clickable={clickable}
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
};

Items.defaultProps = {
  id: null,
  headerElements: [],
  actions: null,
  toolbarActions: null,
  clickable: true,
};

export default Items;
