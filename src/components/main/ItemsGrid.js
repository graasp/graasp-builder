import Grid from '@material-ui/core/Grid';
import { withStyles } from '@material-ui/core/styles';
import { List } from 'immutable';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { withRouter } from 'react-router';
import { ItemSearchInput, NoItemSearchResult } from '../item/ItemSearch';
import EmptyItem from './EmptyItem';
import Item from './Item';
import TableToolbar from './TableToolbar';

const styles = (theme) => ({
  empty: { padding: '5px 20px' },
  title: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: theme.spacing(1),
  },
});

class ItemsGrid extends Component {
  static propTypes = {
    items: PropTypes.instanceOf(List).isRequired,
    match: PropTypes.shape({
      params: PropTypes.shape({ itemId: PropTypes.string }).isRequired,
    }).isRequired,
    classes: PropTypes.shape({
      title: PropTypes.string.isRequired,
      empty: PropTypes.string.isRequired,
    }).isRequired,
    title: PropTypes.string.isRequired,
    itemSearch: PropTypes.shape({
      text: PropTypes.string,
      input: PropTypes.instanceOf(ItemSearchInput),
    }),
  };

  static defaultProps = {
    itemSearch: null,
  };

  renderItems = () => {
    const { classes, items, itemSearch } = this.props;

    if (!items || !items.size) {
      return itemSearch && itemSearch.text ? (
        <div className={classes.empty}>
          <NoItemSearchResult />
        </div>
      ) : (
        <div className={classes.empty}>
          <EmptyItem />
        </div>
      );
    }

    return items.map((item) => (
      <Grid key={item.id} item xs={12} sm={6} md={4} lg={3} xl={2}>
        <Item item={item} />
      </Grid>
    ));
  };

  render() {
    const { title, itemSearch } = this.props;
    return (
      <div>
        <TableToolbar tableTitle={title} itemSearchInput={itemSearch?.input} />
        <Grid container spacing={1}>
          {this.renderItems()}
        </Grid>
      </div>
    );
  }
}
const StyledComponent = withStyles(styles)(ItemsGrid);
export default withRouter(StyledComponent);
