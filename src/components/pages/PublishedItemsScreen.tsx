import { Helmet } from 'react-helmet';

import { Container, Stack, Typography } from '@mui/material';

import { Loader } from '@graasp/ui';

import { useBuilderTranslation } from '../../config/i18n';
import { hooks } from '../../config/queryClient';
import {
  PUBLISHED_ITEMS_ERROR_ALERT_ID,
  PUBLISHED_ITEMS_ID,
} from '../../config/selectors';
import { BUILDER } from '../../langs/constants';
import ErrorAlert from '../common/ErrorAlert';
import { useCurrentUserContext } from '../context/CurrentUserContext';
import { useFilterItemsContext } from '../context/FilterItemsContext';
import { useItemSearch } from '../item/ItemSearch';
import ItemsTable, { useSorting } from '../main/ItemsTable';
import TableToolbar from '../main/TableToolbar';
import { SortingOptions } from '../table/SortingSelect';

const PublishedItemsLoadableContent = (): JSX.Element | null => {
  const { t: translateBuilder } = useBuilderTranslation();
  const { data: member } = useCurrentUserContext();
  const {
    data: publishedItems,
    isLoading,
    isError,
  } = hooks.usePublishedItemsForMember(member?.id);
  const { shouldDisplayItem } = useFilterItemsContext();
  const { sortBy, setSortBy, ordering, setOrdering, sortFn } = useSorting({
    sortBy: SortingOptions.ItemUpdatedAt,
    ordering: 'desc',
  });
  const { input, text } = useItemSearch();
  // TODO: implement filter in the hooks directly ?
  const filteredData = publishedItems?.filter(
    (d) => shouldDisplayItem(d.type) && d.name.includes(text),
  );
  filteredData?.sort(sortFn);

  if (filteredData) {
    return (
      <>
        <Helmet>
          <title>{translateBuilder(BUILDER.PUBLISHED_ITEMS_TITLE)}</title>
        </Helmet>
        <Container sx={{ my: 3 }}>
          <Stack direction="row" justifyContent="space-between" spacing={1}>
            <Typography
              variant="h2"
              component="h1"
              sx={{ wordWrap: 'break-word' }}
            >
              {translateBuilder(BUILDER.PUBLISHED_ITEMS_TITLE)}
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

          <TableToolbar
            sortBy={sortBy}
            setSortBy={setSortBy}
            ordering={ordering}
            setOrdering={setOrdering}
          />
          {filteredData.length ? (
            <ItemsTable
              id={PUBLISHED_ITEMS_ID}
              items={filteredData ?? []}
              canMove={false}
              // totalCount={filteredData.length}
              // pageSize={filteredData.length}
            />
          ) : (
            <Typography>{translateBuilder('No recycled item')}</Typography>
          )}
        </Container>
      </>
    );
  }

  if (isLoading) {
    return <Loader />;
  }

  if (isError) {
    return <ErrorAlert id={PUBLISHED_ITEMS_ERROR_ALERT_ID} />;
  }
  return null;
};

const PublishedItemsScreen = (): JSX.Element => (
  <PublishedItemsLoadableContent />
);

export default PublishedItemsScreen;
