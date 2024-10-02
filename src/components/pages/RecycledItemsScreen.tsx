import { Stack } from '@mui/material';

import { Button } from '@graasp/ui';

import { ITEM_PAGE_SIZE } from '@/config/constants';
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
import LoadingScreen from '../layout/LoadingScreen';
import {
  SelectionContextProvider,
  useSelectionContext,
} from '../main/list/SelectionContext';
import {
  DragContainerStack,
  useDragSelection,
} from '../main/list/useDragSelection';
import ItemCard from '../table/ItemCard';
import SortingSelect from '../table/SortingSelect';
import { SortingOptions } from '../table/types';
import { useSorting, useTranslatedSortingOptions } from '../table/useSorting';
import NoItemFilters from './NoItemFilters';
import PageWrapper from './PageWrapper';
import RecycleBinToolbar from './recycleBin/RecycleBinSelectionToolbar';

const CONTAINER_ID = 'recycle-items-container';

const RecycledItemsScreenContent = ({
  searchText,
}: {
  searchText: string;
}): JSX.Element => {
  const { t: translateBuilder } = useBuilderTranslation();
  const { itemTypes } = useFilterItemsContext();
  const { sortBy, setSortBy, ordering, setOrdering } =
    useSorting<SortingOptions>({
      sortBy: SortingOptions.ItemUpdatedAt,
      ordering: Ordering.DESC,
    });

  const { data, fetchNextPage, isLoading, isFetching } =
    hooks.useInfiniteOwnRecycledItemData(
      {
        sortBy,
        ordering,
        types: itemTypes,
        keywords: searchText,
      },
      // todo: adapt page size given the user window height
      { pageSize: ITEM_PAGE_SIZE },
    );

  const options = useTranslatedSortingOptions();
  const { selectedIds, toggleSelection } = useSelectionContext();

  const DragSelection = useDragSelection({ containerId: CONTAINER_ID });

  // render this when there is data from the query
  if (data?.pages?.length) {
    if (data.pages[0].data.length) {
      const filteredData = data.pages
        .map((p) => p.data)
        ?.flat()
        ?.map((p) => p.item);

      const totalFetchedItems = data
        ? data.pages.map(({ data: d }) => d.length).reduce((a, b) => a + b, 0)
        : 0;

      const hasSelection = selectedIds.length && filteredData?.length;
      return (
        <>
          <Stack gap={1} height="100%">
            <Stack
              alignItems="space-between"
              direction="column"
              gap={1}
              width="100%"
            >
              {hasSelection ? (
                <RecycleBinToolbar items={filteredData} />
              ) : (
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
              )}
            </Stack>
            <DragContainerStack id={CONTAINER_ID}>
              {filteredData.map((item) => (
                <Stack mb={1}>
                  <ItemCard
                    item={item}
                    onThumbnailClick={() => toggleSelection(item.id)}
                    isSelected={selectedIds.includes(item.id)}
                    allowNavigation={false}
                    footer={
                      <Stack justifyContent="right" direction="row">
                        <RestoreButton itemIds={[item.id]} />
                        <DeleteButton items={[item]} />
                      </Stack>
                    }
                  />
                </Stack>
              ))}
              {!isFetching && data.pages[0].totalCount > totalFetchedItems && (
                <Stack textAlign="center" alignItems="center">
                  <Button
                    variant="outlined"
                    onClick={fetchNextPage}
                    role="feed"
                  >
                    {translateBuilder(BUILDER.HOME_SCREEN_LOAD_MORE_BUTTON)}
                  </Button>
                </Stack>
              )}
            </DragContainerStack>
          </Stack>
          {DragSelection}
        </>
      );
    }
    if (itemTypes.length || searchText) {
      return <NoItemFilters searchText={searchText} />;
    }
  }

  if (isLoading) {
    return <LoadingScreen />;
  }

  return <ErrorAlert id={RECYCLED_ITEMS_ERROR_ALERT_ID} />;
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
      <SelectionContextProvider>
        <RecycledItemsScreenContent searchText={itemSearch.text} />
      </SelectionContextProvider>
    </PageWrapper>
  );
};

export default RecycledItemsScreen;
