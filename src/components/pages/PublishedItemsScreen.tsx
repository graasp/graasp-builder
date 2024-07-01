import { Helmet } from 'react-helmet';

import { Container, Stack, Typography } from '@mui/material';

import { Loader } from '@graasp/ui';

import { Ordering } from '@/enums';

import { useBuilderTranslation } from '../../config/i18n';
import { hooks } from '../../config/queryClient';
import {
  PUBLISHED_ITEMS_ERROR_ALERT_ID,
  PUBLISHED_ITEMS_ID,
} from '../../config/selectors';
import { BUILDER } from '../../langs/constants';
import ErrorAlert from '../common/ErrorAlert';
import SelectTypes from '../common/SelectTypes';
import { useCurrentUserContext } from '../context/CurrentUserContext';
import { useFilterItemsContext } from '../context/FilterItemsContext';
import { useItemSearch } from '../item/ItemSearch';
import ModeButton from '../item/header/ModeButton';
import ItemsTable from '../main/ItemsTable';
import SortingSelect from '../table/SortingSelect';
import {
  SortingOptions,
  useSorting,
  useTranslatedSortingOptions,
} from '../table/useSorting';

const PublishedItemsLoadableContent = (): JSX.Element | null => {
  const { t: translateBuilder } = useBuilderTranslation();
  const { data: member } = useCurrentUserContext();
  const {
    data: publishedItems,
    isLoading,
    isError,
  } = hooks.usePublishedItemsForMember(member?.id);
  const options = useTranslatedSortingOptions();
  const { shouldDisplayItem } = useFilterItemsContext();
  const { sortBy, setSortBy, ordering, setOrdering, sortFn } =
    useSorting<SortingOptions>({
      sortBy: SortingOptions.ItemUpdatedAt,
      ordering: Ordering.DESC,
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

          <Stack
            alignItems="space-between"
            direction="column"
            mt={2}
            gap={1}
            width="100%"
          >
            <Stack
              spacing={1}
              direction="row"
              justifyContent="space-between"
              alignItems="center"
            >
              <SelectTypes />
              <Stack direction="row" gap={1}>
                {sortBy && setSortBy && (
                  <SortingSelect
                    sortBy={sortBy}
                    setSortBy={setSortBy}
                    ordering={ordering}
                    setOrdering={setOrdering}
                    options={options}
                  />
                )}
                <ModeButton />
              </Stack>
            </Stack>
          </Stack>
          {filteredData.length ? (
            <ItemsTable
              id={PUBLISHED_ITEMS_ID}
              items={filteredData ?? []}
              canMove={false}
            />
          ) : (
            <Typography>{translateBuilder(BUILDER.TRASH_NO_ITEM)}</Typography>
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
