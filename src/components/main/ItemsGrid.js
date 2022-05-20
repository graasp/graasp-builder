import { Box, makeStyles, Typography } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import Pagination from '@material-ui/lab/Pagination';
import { List } from 'immutable';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { GRID_ITEMS_PER_PAGE_CHOICES } from '../../config/constants';
import {
  ITEMS_GRID_ITEMS_PER_PAGE_SELECT_ID,
  ITEMS_GRID_ITEMS_PER_PAGE_SELECT_LABEL_ID,
  ITEMS_GRID_PAGINATION_ID,
} from '../../config/selectors';
import { getMembershipsForItem } from '../../utils/membership';
import { ItemSearchInput, NoItemSearchResult } from '../item/ItemSearch';
import EmptyItem from './EmptyItem';
import Item from './Item';
import FolderDescription from '../item/FolderDescription';
import ItemsToolbar from './ItemsToolbar';

const useStyles = makeStyles((theme) => ({
  empty: { padding: theme.spacing(1, 2.5) },
  title: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: theme.spacing(1),
  },
  paginationControls: {
    padding: theme.spacing(2),
    alignItems: 'center',
  },
  itemsPerPageSelect: {
    position: 'absolute',
    right: theme.spacing(2),
    alignItems: 'center',
  },
  itemsPerPageLabel: {
    paddingRight: theme.spacing(1),
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
}));

const ItemsGrid = (props) => {
  const {
    items,
    title,
    itemSearch,
    headerElements,
    memberships,
    isEditing,
    parentId,
  } = props;

  const { t } = useTranslation();
  const classes = useStyles();
  const [page, setPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(
    GRID_ITEMS_PER_PAGE_CHOICES[0],
  );

  const pagesCount = Math.ceil(items.size / itemsPerPage);

  // bugfix: since page state is independent from search, must ensure always within range
  if (page !== 1 && page > pagesCount) {
    setPage(1);
  }

  const start = (page - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  const itemsInPage = items.slice(start, end);

  const renderItems = () => {
    if (!itemsInPage || !itemsInPage.size) {
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

    return itemsInPage.map((item) => (
      <Grid key={item.id} item xs={12} sm={12} md={6} lg={4} xl={2}>
        <Item
          item={item}
          memberships={getMembershipsForItem({ items, memberships, item })}
        />
      </Grid>
    ));
  };

  return (
    <div>
      <ItemsToolbar title={title} headerElements={headerElements} />
      <FolderDescription itemId={parentId} isEditing={isEditing} />
      <Grid container spacing={1}>
        {renderItems()}
      </Grid>
      <Box
        display="flex"
        justifyContent="center"
        className={classes.paginationControls}
      >
        <Box display="flex" className={classes.itemsPerPageSelect}>
          <Typography className={classes.itemsPerPageLabel} variant="body2">
            {t('Items per page')}
          </Typography>
          <Select
            labelId={ITEMS_GRID_ITEMS_PER_PAGE_SELECT_LABEL_ID}
            id={ITEMS_GRID_ITEMS_PER_PAGE_SELECT_ID}
            value={itemsPerPage}
            onChange={(e) => setItemsPerPage(e.target.value)}
            label="Items per page"
          >
            {GRID_ITEMS_PER_PAGE_CHOICES.map((v) => (
              <MenuItem value={v}>{v}</MenuItem>
            ))}
          </Select>
        </Box>
        <Pagination
          id={ITEMS_GRID_PAGINATION_ID}
          count={pagesCount}
          page={page}
          onChange={(e, v) => setPage(v)}
          className={classes.paginationControls}
        />
      </Box>
    </div>
  );
};

ItemsGrid.propTypes = {
  items: PropTypes.instanceOf(List).isRequired,
  memberships: PropTypes.instanceOf(List).isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({ itemId: PropTypes.string }).isRequired,
  }).isRequired,
  classes: PropTypes.shape({
    title: PropTypes.string.isRequired,
    empty: PropTypes.string.isRequired,
    paginationControls: PropTypes.string.isRequired,
    formControl: PropTypes.string.isRequired,
    itemsPerPageSelect: PropTypes.string.isRequired,
    itemsPerPageLabel: PropTypes.string.isRequired,
  }).isRequired,
  title: PropTypes.string.isRequired,
  itemSearch: PropTypes.shape({
    text: PropTypes.string,
    input: PropTypes.instanceOf(ItemSearchInput),
  }),
  headerElements: PropTypes.arrayOf(PropTypes.element),
  parentId: PropTypes.string,
  isEditing: PropTypes.bool,
};

ItemsGrid.defaultProps = {
  itemSearch: null,
  headerElements: [],
  isEditing: false,
  parentId: null,
};

export default ItemsGrid;
