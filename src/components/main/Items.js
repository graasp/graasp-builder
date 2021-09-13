import { List } from 'immutable';
import PropTypes from 'prop-types';
import React, { useContext } from 'react';
import { ITEM_LAYOUT_MODES } from '../../enums';
import { LayoutContext } from '../context/LayoutContext';
import { useItemSearch } from '../item/ItemSearch';
import ItemsGrid from './ItemsGrid';
import ItemsTable from './ItemsTable';

const Items = ({ items, title, id, headerElements }) => {
  const { mode } = useContext(LayoutContext);
  const itemSearch = useItemSearch(items);

  switch (mode) {
    case ITEM_LAYOUT_MODES.GRID:
      return (
        <ItemsGrid
          id={id}
          title={title}
          items={itemSearch.results}
          itemSearch={itemSearch}
          headerElements={headerElements}
        />
      );
    case ITEM_LAYOUT_MODES.LIST:
    default:
      return (
        <ItemsTable
          id={id}
          tableTitle={title}
          items={itemSearch.results}
          itemSearch={itemSearch}
          headerElements={headerElements}
        />
      );
  }
};

Items.propTypes = {
  items: PropTypes.instanceOf(List).isRequired,
  title: PropTypes.string.isRequired,
  id: PropTypes.string,
  headerElements: PropTypes.arrayOf(PropTypes.element),
};

Items.defaultProps = {
  id: null,
  headerElements: []
};

export default Items;
