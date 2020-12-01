import React, { Component } from 'react';
import Grid from '@material-ui/core/Grid';
import ItemsHeader from './ItemsHeader';
import CreateNewItemButton from './CreateNewItemButton';
import Item from './Item';
import { ItemContext } from '../context/item';

class Items extends Component {
  static contextType = ItemContext;

  render() {
    const { items } = this.context;
    return (
      <div>
        <ItemsHeader />
        <CreateNewItemButton />
        <Grid container spacing={1}>
          {items.reverse().map((item) => (
            <Grid key={item.id} item xs={12} sm={6} md={4} lg={3} xl={2}>
              <Item item={item} />
            </Grid>
          ))}
        </Grid>
      </div>
    );
  }
}

export default Items;
