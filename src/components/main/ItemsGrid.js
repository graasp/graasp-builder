import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Item from './Item';

class ItemsGrid extends Component {
  static propTypes = {
    items: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
    match: PropTypes.shape({
      params: PropTypes.shape({ itemId: PropTypes.string }).isRequired,
    }).isRequired,
  };

  renderItems = () => {
    const { items } = this.props;
    if (!items?.length) {
      return (
        <Typography variant="h3" align="center" display="block">
          No Item Here
        </Typography>
      );
    }

    return items.map((item) => (
      <Grid key={item.id} item xs={12} sm={6} md={4} lg={3} xl={2}>
        <Item item={item} />
      </Grid>
    ));
  };

  render() {
    return (
      <Grid container spacing={1}>
        {this.renderItems()}
      </Grid>
    );
  }
}

export default withRouter(ItemsGrid);
