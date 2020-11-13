import React from 'react';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import ItemsHeader from './ItemsHeader';
import CreateNewItemButton from './CreateNewItemButton';
import Item from './Item';

const Items = ({ items }) => {
  return (
    <div>
      <ItemsHeader />
      <CreateNewItemButton />
      <Grid container spacing={1}>
        {items.map((item) => (
          <Grid key={item.id} item xs={12} sm={6} md={4} lg={3} xl={2}>
            <Item item={item} />
          </Grid>
        ))}
      </Grid>
    </div>
  );
};

Items.propTypes = {
  items: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
};

export default Items;
