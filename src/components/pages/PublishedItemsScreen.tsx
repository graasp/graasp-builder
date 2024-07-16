import { Alert, Box, Stack } from '@mui/material';

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
import { useFilterItemsContext } from '../context/FilterItemsContext';
import { useItemSearch } from '../item/ItemSearch';
import ModeButton from '../item/header/ModeButton';
import ItemsTable from '../main/ItemsTable';
import SortingSelect from '../table/SortingSelect';
import { SortingOptions } from '../table/types';
import { useSorting, useTranslatedSortingOptions } from '../table/useSorting';
import PageWrapper from './PageWrapper';

const PublishedItemsScreenContent = ({
  searchText,
}: {
  searchText: string;
}) => {
  const { t: translateBuilder } = useBuilderTranslation();
  const { data: member } = hooks.useCurrentMember();
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
  const filteredData = publishedItems?.filter(
    (d) => shouldDisplayItem(d.type) && d.name.includes(searchText),
  );
  filteredData?.sort(sortFn);

  if (isError) {
    return (
      <Box mt={2}>
        <ErrorAlert id={PUBLISHED_ITEMS_ERROR_ALERT_ID} />
      </Box>
    );
  }

  if (!publishedItems?.length) {
    return (
      <Alert severity="info">
        {translateBuilder(BUILDER.PUBLISHED_ITEMS_EMPTY)}
      </Alert>
    );
  }

  if (filteredData) {
    return (
      <>
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
            enableMoveInBetween={false}
          />
        ) : (
          <Box mt={2}>
            <Alert severity="info">
              {translateBuilder(BUILDER.PUBLISHED_ITEMS_NOT_FOUND_SEARCH, {
                search: searchText,
              })}
            </Alert>
          </Box>
        )}
      </>
    );
  }
  if (isLoading) {
    return <Loader />;
  }

  return (
    <Box mt={2}>
      <ErrorAlert id={PUBLISHED_ITEMS_ERROR_ALERT_ID} />;
    </Box>
  );
};

const PublishedItemsScreen = (): JSX.Element | null => {
  const { t: translateBuilder } = useBuilderTranslation();
  const { input, text } = useItemSearch();

  return (
    <PageWrapper
      id={PUBLISHED_ITEMS_ID}
      title={translateBuilder(BUILDER.PUBLISHED_ITEMS_TITLE)}
      options={
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="flex-end"
          spacing={1}
        >
          {input}
        </Stack>
      }
    >
      <PublishedItemsScreenContent searchText={text} />
    </PageWrapper>
  );
};

export default PublishedItemsScreen;
