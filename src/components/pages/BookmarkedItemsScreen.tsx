import { Alert, Stack } from '@mui/material';

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
import LoadingScreen from '../layout/LoadingScreen';
import ItemsTable from '../main/list/ItemsTable';
import SortingSelect from '../table/SortingSelect';
import { SortingOptions } from '../table/types';
import { useSorting, useTranslatedSortingOptions } from '../table/useSorting';
import PageWrapper from './PageWrapper';

const BookmarkedItems = ({
  searchText,
}: {
  searchText: string;
}): JSX.Element | null => {
  const { t: translateBuilder } = useBuilderTranslation();
  const {
    data: bookmarkedItems,
    isLoading,
    isError,
  } = hooks.useBookmarkedItems();
  const { shouldDisplayItem } = useFilterItemsContext();

  const { sortBy, setSortBy, ordering, setOrdering, sortFn } =
    useSorting<SortingOptions>({
      sortBy: SortingOptions.ItemUpdatedAt,
      ordering: Ordering.DESC,
    });
  const options = useTranslatedSortingOptions();

  const filteredData = bookmarkedItems
    ?.map((d) => d.item)
    ?.filter(
      (item) =>
        shouldDisplayItem(item.type) &&
        item.name.toLowerCase().includes(searchText.toLowerCase()),
    );

  filteredData?.sort(sortFn);

  if (bookmarkedItems?.length) {
    return (
      <Stack gap={1}>
        <Stack
          alignItems="space-between"
          direction="column"
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
        {filteredData?.length ? (
          <ItemsTable
            items={filteredData}
            canMove={false}
            enableMoveInBetween={false}
          />
        ) : (
          <Alert severity="info">
            {translateBuilder(BUILDER.BOOKMARKS_NO_ITEM_SEARCH, {
              search: searchText,
            })}
          </Alert>
        )}
      </Stack>
    );
  }

  if (isError) {
    return <ErrorAlert id={BOOKMARKED_ITEMS_ERROR_ALERT_ID} />;
  }

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <Alert severity="info">{translateBuilder(BUILDER.BOOKMARKS_NO_ITEM)}</Alert>
  );
};

const BookmarkedItemsWrapper = (): JSX.Element => {
  const { t } = useBuilderTranslation();
  const itemSearch = useItemSearch();

  return (
    <PageWrapper
      title={t(BUILDER.BOOKMARKED_ITEMS_TITLE)}
      id={BOOKMARKED_ITEMS_ID}
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
      <BookmarkedItems searchText={itemSearch.text} />
    </PageWrapper>
  );
};

export default BookmarkedItemsWrapper;
