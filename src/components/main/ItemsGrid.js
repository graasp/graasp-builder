import { List } from 'immutable';
import PropTypes from 'prop-types';

import { Box, Typography, styled } from '@mui/material';
import Grid from '@mui/material/Grid';
import MenuItem from '@mui/material/MenuItem';
import Pagination from '@mui/material/Pagination';
import Select from '@mui/material/Select';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { GRID_ITEMS_PER_PAGE_CHOICES } from '../../config/constants';
import {
  ITEMS_GRID_ITEMS_PER_PAGE_SELECT_ID,
  ITEMS_GRID_ITEMS_PER_PAGE_SELECT_LABEL_ID,
  ITEMS_GRID_PAGINATION_ID,
} from '../../config/selectors';
import { getMembershipsForItem } from '../../utils/membership';
import FolderDescription from '../item/FolderDescription';
import { NoItemSearchResult } from '../item/ItemSearch';
import EmptyItem from './EmptyItem';
import Item from './Item';
import ItemsToolbar from './ItemsToolbar';

const StyledBox = styled(Box)(({ theme }) => ({
  position: 'absolute',
  right: theme.spacing(2),
  alignItems: 'center',
}));

const ItemsGrid = (props) => {
  const {
    items = List(),
    title,
    itemSearch,
    headerElements,
    memberships,
    isEditing,
    parentId,
  } = props;

  const { t } = useTranslation();
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
      return (
        <Box py={1} px={2}>
          {itemSearch && itemSearch.text ? (
            <NoItemSearchResult />
          ) : (
            <EmptyItem />
          )}
        </Box>
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
      <Box p={2} alignItems="center" display="flex" justifyContent="center">
        <StyledBox display="flex">
          <Typography pr={1} variant="body2">
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
              <MenuItem value={v} key={v}>
                {v}
              </MenuItem>
            ))}
          </Select>
        </StyledBox>
        <Pagination
          p={2}
          alignItems="center"
          id={ITEMS_GRID_PAGINATION_ID}
          count={pagesCount}
          page={page}
          onChange={(e, v) => setPage(v)}
        />
      </Box>
    </div>
  );
};

ItemsGrid.propTypes = {
  items: PropTypes.instanceOf(List).isRequired,
  memberships: PropTypes.instanceOf(List).isRequired,
  title: PropTypes.string.isRequired,
  itemSearch: PropTypes.shape({
    text: PropTypes.string,
    // input: PropTypes.instanceOf(ItemSearchInput),
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
