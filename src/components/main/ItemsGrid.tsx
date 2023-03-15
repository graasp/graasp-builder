import { List } from 'immutable';

import { Box, Typography, styled } from '@mui/material';
import Grid from '@mui/material/Grid';
import MenuItem from '@mui/material/MenuItem';
import Pagination from '@mui/material/Pagination';
import Select from '@mui/material/Select';

import { useState } from 'react';

import {
  ItemMembershipRecord,
  ItemRecord,
  TagRecord,
} from '@graasp/sdk/frontend';
import { BUILDER } from '@graasp/translations';

import { GRID_ITEMS_PER_PAGE_CHOICES } from '../../config/constants';
import { useBuilderTranslation } from '../../config/i18n';
import {
  ITEMS_GRID_ITEMS_PER_PAGE_SELECT_ID,
  ITEMS_GRID_ITEMS_PER_PAGE_SELECT_LABEL_ID,
  ITEMS_GRID_PAGINATION_ID,
} from '../../config/selectors';
import { getMembershipsForItem } from '../../utils/membership';
import FolderDescription from '../item/FolderDescription';
import { NoItemSearchResult } from '../item/ItemSearch';
import EmptyItem from './EmptyItem';
import ItemCard from './ItemCard';
import ItemsToolbar from './ItemsToolbar';

const StyledBox = styled(Box)(({ theme }) => ({
  position: 'absolute',
  right: theme.spacing(2),
  alignItems: 'center',
}));

type Props = {
  id?: string;
  items?: List<ItemRecord>;
  manyMemberships?: List<List<ItemMembershipRecord>>;
  tagList?: List<TagRecord>;
  title: string;
  itemSearch?: {
    text: string;
    // input: PropTypes.instanceOf(ItemSearchInput),
  };
  headerElements?: JSX.Element[];
  parentId?: string;
  isEditing?: boolean;
};

const ItemsGrid = ({
  id: gridId = '',
  items = List(),
  title,
  itemSearch,
  headerElements = [],
  manyMemberships = List(),
  tagList = List(),
  isEditing = false,
  parentId,
}: Props): JSX.Element => {
  const { t: translateBuilder } = useBuilderTranslation();
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
      <Grid key={item.id} item xs={12} sm={12} md={6} lg={6} xl={4}>
        <ItemCard
          item={item}
          memberships={getMembershipsForItem({
            items,
            manyMemberships,
            itemId: item.id,
          })}
          tagList={tagList}
        />
      </Grid>
    ));
  };

  return (
    <div id={gridId}>
      <ItemsToolbar title={title} headerElements={headerElements} />
      <FolderDescription itemId={parentId} isEditing={isEditing} />
      <Grid container spacing={2}>
        {renderItems()}
      </Grid>
      <Box p={2} alignItems="center" display="flex" justifyContent="center">
        <StyledBox display="flex">
          <Typography pr={1} variant="body2">
            {translateBuilder(BUILDER.ITEMS_GRID_ITEMS_PER_PAGE_TITLE)}
          </Typography>
          <Select
            labelId={ITEMS_GRID_ITEMS_PER_PAGE_SELECT_LABEL_ID}
            id={ITEMS_GRID_ITEMS_PER_PAGE_SELECT_ID}
            value={itemsPerPage}
            onChange={(e) => setItemsPerPage(e.target.value as number)}
            label={translateBuilder(BUILDER.ITEMS_GRID_ITEMS_PER_PAGE_TITLE)}
          >
            {GRID_ITEMS_PER_PAGE_CHOICES.map((v) => (
              <MenuItem value={v} key={v}>
                {v}
              </MenuItem>
            ))}
          </Select>
        </StyledBox>
        <Pagination
          id={ITEMS_GRID_PAGINATION_ID}
          count={pagesCount}
          page={page}
          onChange={(_e, v) => setPage(v)}
        />
      </Box>
    </div>
  );
};

export default ItemsGrid;
