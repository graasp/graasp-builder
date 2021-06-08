import React, { useContext } from 'react';
import { List } from 'immutable';
import PropTypes from 'prop-types';
import { ITEM_LAYOUT_MODES } from '../../enums';
import ItemsTable from './ItemsTable';
import ItemsGrid from './ItemsGrid';
import { ItemLayoutModeContext } from '../context/ItemLayoutModeContext';

const Items = ({ items, title, id }) => {
  const { mode } = useContext(ItemLayoutModeContext);

  switch (mode) {
    case ITEM_LAYOUT_MODES.GRID:
      return <ItemsGrid id={id} title={title} items={items} />;
    case ITEM_LAYOUT_MODES.LIST:
    default:
      return <ItemsTable id={id} tableTitle={title} items={items} />;
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
