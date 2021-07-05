import { List } from 'immutable';
import PropTypes from 'prop-types';
import React, { useContext } from 'react';
import { ITEM_LAYOUT_MODES } from '../../enums';
import { LayoutContext } from '../context/LayoutContext';
import { useItemSearch } from '../item/ItemSearch';
import ItemsGrid from './ItemsGrid';
import ItemsTable from './ItemsTable';

const Items = ({ items, title, id }) => {
  const { mode } = useContext(LayoutContext);
  const { searchResults, itemSearchInput } = useItemSearch(items);

  switch (mode) {
    case ITEM_LAYOUT_MODES.GRID:
      return (
        <ItemsGrid
          id={id}
          title={title}
          items={searchResults}
          searchInput={itemSearchInput}
        />
      );
    case ITEM_LAYOUT_MODES.LIST:
    default:
      return (
        <ItemsTable
          id={id}
          tableTitle={title}
          items={searchResults}
          searchInput={itemSearchInput}
        />
      );
  }
};

Items.propTypes = {
  items: PropTypes.instanceOf(List).isRequired,
  title: PropTypes.string.isRequired,
  id: PropTypes.string,
};

Items.defaultProps = {
  id: null,
};

export default Items;
