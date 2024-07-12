import { Alert, Box, Stack } from '@mui/material';

import { Loader } from '@graasp/ui';

import { Ordering } from '@/enums';

import { useBuilderTranslation } from '../../config/i18n';
import { hooks } from '../../config/queryClient';
import {
  BOOKMARKED_ITEMS_ERROR_ALERT_ID,
  BOOKMARKED_ITEMS_ID,
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

const BookmarkedItems = (): JSX.Element | null => {
  const { t: translateBuilder } = useBuilderTranslation();
  const {
    data,
    isLoading: isItemsLoading,
    isError,
  } = hooks.useBookmarkedItems();
  const { shouldDisplayItem } = useFilterItemsContext();
  const { input, text } = useItemSearch();

  const { sortBy, setSortBy, ordering, setOrdering, sortFn } =
    useSorting<SortingOptions>({
      sortBy: SortingOptions.ItemUpdatedAt,
      ordering: Ordering.DESC,
    });
  const options = useTranslatedSortingOptions();

  const filteredData = data
    ?.map((d) => d.item)
    ?.filter(
      (item) => shouldDisplayItem(item.type) && item.name.includes(text),
    );

  filteredData?.sort(sortFn);

  const renderContent = () => {
    if (isError) {
      return (
        <Box mt={2}>
          <ErrorAlert id={BOOKMARKED_ITEMS_ERROR_ALERT_ID} />
        </Box>
      );
    }

    if (!data?.length) {
      return (
        <Alert severity="info">
          {translateBuilder(BUILDER.BOOKMARKS_NO_ITEM)}
        </Alert>
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
                    options={options}
                    sortBy={sortBy}
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
            <ItemsTable
              items={filteredData}
              canMove={false}
              enableMoveInBetween={false}
            />
          ) : (
            <Alert severity="info">
              {translateBuilder(BUILDER.BOOKMARKS_NO_ITEM_SEARCH, {
                search: text,
              })}
            </Alert>
          )}
        </Stack>
      );
    }

    if (isItemsLoading) {
      return <Loader />;
    }

    return (
      <Box mt={2}>
        <ErrorAlert id={BOOKMARKED_ITEMS_ERROR_ALERT_ID} />
      </Box>
    );
  };

  return (
    <PageWrapper
      title={translateBuilder(BUILDER.BOOKMARKED_ITEMS_TITLE)}
      id={BOOKMARKED_ITEMS_ID}
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
      {renderContent()}
    </PageWrapper>
  );
};

export default BookmarkedItems;
