import { Alert, Box, Stack, Typography } from '@mui/material';

import { Loader } from '@graasp/ui';

import { Ordering } from '@/enums';

import { useBuilderTranslation } from '../../config/i18n';
import { hooks } from '../../config/queryClient';
import {
  RECYCLED_ITEMS_ERROR_ALERT_ID,
  RECYCLED_ITEMS_ROOT_CONTAINER,
} from '../../config/selectors';
import { BUILDER } from '../../langs/constants';
import DeleteButton from '../common/DeleteButton';
import ErrorAlert from '../common/ErrorAlert';
import RestoreButton from '../common/RestoreButton';
import SelectTypes from '../common/SelectTypes';
import { useFilterItemsContext } from '../context/FilterItemsContext';
import { useItemSearch } from '../item/ItemSearch';
import ModeButton from '../item/header/ModeButton';
import ItemCard from '../table/ItemCard';
import SortingSelect from '../table/SortingSelect';
import { SortingOptions } from '../table/types';
import { useSorting, useTranslatedSortingOptions } from '../table/useSorting';
import PageWrapper from './PageWrapper';

const RecycledItemsScreenContent = ({
  searchText,
}: {
  searchText: string;
}): JSX.Element => {
  const { t: translateBuilder } = useBuilderTranslation();
  const { data: recycledItems, isLoading, isError } = hooks.useRecycledItems();
  const options = useTranslatedSortingOptions();
  const { shouldDisplayItem } = useFilterItemsContext();
  const filteredData = recycledItems?.filter(
    (d) => shouldDisplayItem(d.type) && d.name.includes(searchText),
  );
  const { sortBy, setSortBy, ordering, setOrdering, sortFn } =
    useSorting<SortingOptions>({
      sortBy: SortingOptions.ItemUpdatedAt,
      ordering: Ordering.DESC,
    });
  filteredData?.sort(sortFn);

  if (isError) {
    return (
      <Box mt={2}>
        <ErrorAlert id={RECYCLED_ITEMS_ERROR_ALERT_ID} />;
      </Box>
    );
  }
  if (!recycledItems?.length) {
    return (
      <Alert severity="info">{translateBuilder(BUILDER.TRASH_NO_ITEM)}</Alert>
    );
  }

  if (filteredData) {
    return (
      <Stack gap={1}>
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
                  options={options}
                  setSortBy={setSortBy}
                  ordering={ordering}
                  setOrdering={setOrdering}
                />
              )}
              <ModeButton />
            </Stack>
          </Stack>
        </Stack>
        {filteredData.length ? (
          filteredData.map((item) => (
            <ItemCard
              item={item}
              showThumbnail={false}
              footer={
                <>
                  <RestoreButton itemIds={[item.id]} />
                  <DeleteButton itemIds={[item.id]} />
                </>
              }
            />
          ))
        ) : (
          <Typography variant="body2">
            {translateBuilder(BUILDER.TRASH_NO_ITEM_SEARCH, {
              search: searchText,
            })}
          </Typography>
        )}
      </Stack>
    );
  }

  if (isLoading) {
    return <Loader />;
  }

  return (
    <Box mt={2}>
      <ErrorAlert id={RECYCLED_ITEMS_ERROR_ALERT_ID} />;
    </Box>
  );
};

const RecycledItemsScreen = (): JSX.Element | null => {
  const { t: translateBuilder } = useBuilderTranslation();
  const itemSearch = useItemSearch();

  return (
    <PageWrapper
      title={translateBuilder(BUILDER.RECYCLE_BIN_TITLE)}
      id={RECYCLED_ITEMS_ROOT_CONTAINER}
      options={
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="flex-end"
          spacing={1}
        >
          {itemSearch.input}
        </Stack>
      }
    >
      <RecycledItemsScreenContent searchText={itemSearch.text} />
    </PageWrapper>
  );
};

export default RecycledItemsScreen;
