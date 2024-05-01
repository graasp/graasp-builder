import { Helmet } from 'react-helmet';

import { Container, Stack, Typography } from '@mui/material';

import { Loader } from '@graasp/ui';

import { useBuilderTranslation } from '../../config/i18n';
import { hooks } from '../../config/queryClient';
import {
  BOOKMARKED_ITEMS_ID,
  FAVORITE_ITEMS_ERROR_ALERT_ID,
} from '../../config/selectors';
import { BUILDER } from '../../langs/constants';
import ErrorAlert from '../common/ErrorAlert';
import { useFilterItemsContext } from '../context/FilterItemsContext';
import { useItemSearch } from '../item/ItemSearch';
import ItemsTable, { useSorting } from '../main/ItemsTable';
import TableToolbar from '../main/TableToolbar';
import { SortingOptions } from '../table/SortingSelect';

const BookmarkedItemsLoadableContent = (): JSX.Element | null => {
  const { t: translateBuilder } = useBuilderTranslation();
  const {
    data,
    isLoading: isItemsLoading,
    isError,
  } = hooks.useBookmarkedItems();
  const { shouldDisplayItem } = useFilterItemsContext();
  // TODO: implement filter in the hooks directly ?
  const { input, text } = useItemSearch();

  const { sortBy, setSortBy, ordering, setOrdering, sortFn } = useSorting({
    sortBy: SortingOptions.ItemUpdatedAt,
    ordering: 'desc',
  });

  const filteredData = data
    ?.map((d) => d.item)
    ?.filter(
      (item) => shouldDisplayItem(item.type) && item.name.includes(text),
    );

  filteredData?.sort(sortFn);

  if (filteredData) {
    return (
      <>
        <Helmet>
          <title>{translateBuilder(BUILDER.BOOKMARKED_ITEMS_TITLE)}</title>
        </Helmet>
        <Container sx={{ my: 3 }}>
          <Stack direction="row" justifyContent="space-between" spacing={1}>
            <Typography
              variant="h2"
              component="h1"
              sx={{ wordWrap: 'break-word' }}
            >
              {translateBuilder(BUILDER.BOOKMARKED_ITEMS_TITLE)}
            </Typography>
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="flex-end"
              spacing={1}
            >
              {input}
            </Stack>
          </Stack>
          <Stack gap={1}>
            <TableToolbar
              sortBy={sortBy}
              setSortBy={setSortBy}
              ordering={ordering}
              setOrdering={setOrdering}
            />
            {filteredData.length ? (
              <ItemsTable
                id={BOOKMARKED_ITEMS_ID}
                items={filteredData}
                canMove={false}
                pageSize={filteredData.length}
                totalCount={filteredData.length}
              />
            ) : (
              <Typography variant="body2">
                {translateBuilder(BUILDER.BOOKMARKS_NO_ITEM)}
              </Typography>
            )}
          </Stack>
        </Container>
      </>
    );
  }

  if (isItemsLoading) {
    return <Loader />;
  }
  if (isError) {
    return <ErrorAlert id={FAVORITE_ITEMS_ERROR_ALERT_ID} />;
  }
  return null;
};

const BookmarkedItemsScreen = (): JSX.Element => (
  <BookmarkedItemsLoadableContent />
);

export default BookmarkedItemsScreen;
