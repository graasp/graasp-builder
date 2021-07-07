import { Box } from '@material-ui/core';
import FormControl from '@material-ui/core/FormControl';
import Grid from '@material-ui/core/Grid';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import { withStyles } from '@material-ui/core/styles';
import Pagination from '@material-ui/lab/Pagination';
import { List } from 'immutable';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { withRouter } from 'react-router';
import {
  ITEMS_GRID_ITEMS_PER_PAGE_SELECT_ID,
  ITEMS_GRID_ITEMS_PER_PAGE_SELECT_LABEL_ID,
} from '../../config/selectors';
import { ItemSearchInput, NoItemSearchResult } from '../item/ItemSearch';
import EmptyItem from './EmptyItem';
import Item from './Item';
import TableToolbar from './TableToolbar';

/* possible choices for number of items per page in grid,
   (must be common multiple for possible row counts of 1,2,3,4,6) */
const GRID_ITEMS_PER_PAGE_CHOICES = [12, 24, 36, 48];

const styles = (theme) => ({
  empty: { padding: theme.spacing(1, 2.5) },
  title: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: theme.spacing(1),
  },
  paginationControls: {
    padding: theme.spacing(2),
  },
  itemsPerPageSelect: {
    position: 'absolute',
    left: theme.spacing(1),
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
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
      paginationControls: PropTypes.string.isRequired,
      formControl: PropTypes.string.isRequired,
      itemsPerPageSelect: PropTypes.string.isRequired,
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

  state = {
    page: 1,
    itemsPerPage: GRID_ITEMS_PER_PAGE_CHOICES[0],
  };

  handleItemsPerPage = (event) => {
    this.setState({
      itemsPerPage: event.target.value,
    });
  };

  handlePagination = (event, value) => {
    this.setState({
      page: value,
    });
  };

  renderItems = (items) => {
    const { classes, itemSearch } = this.props;

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
    const { classes, items, title, itemSearch } = this.props;
    const { page, itemsPerPage } = this.state;

    const pagesCount = Math.ceil(items.size / itemsPerPage);

    const start = (page - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const itemsInPage = items.slice(start, end);

    return (
      <div>
        <TableToolbar tableTitle={title} itemSearchInput={itemSearch?.input} />
        <Grid container spacing={1}>
          {this.renderItems(itemsInPage)}
        </Grid>
        <Box
          display="flex"
          justifyContent="center"
          className={classes.paginationControls}
        >
          <Box className={classes.itemsPerPageSelect}>
            <FormControl className={classes.formControl}>
              <InputLabel id={ITEMS_GRID_ITEMS_PER_PAGE_SELECT_LABEL_ID}>
                Items per page
              </InputLabel>
              <Select
                labelId={ITEMS_GRID_ITEMS_PER_PAGE_SELECT_LABEL_ID}
                id={ITEMS_GRID_ITEMS_PER_PAGE_SELECT_ID}
                value={itemsPerPage}
                onChange={this.handleItemsPerPage}
                label="Items per page"
              >
                {GRID_ITEMS_PER_PAGE_CHOICES.map((v) => (
                  <MenuItem value={v}>{v}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
          <Pagination
            count={pagesCount}
            page={page}
            onChange={this.handlePagination}
            className={classes.paginationControls}
          />
        </Box>
      </div>
    );
  }
}
const StyledComponent = withStyles(styles)(ItemsGrid);
export default withRouter(StyledComponent);
