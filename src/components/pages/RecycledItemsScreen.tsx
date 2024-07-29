import { Alert, Stack, useTheme } from '@mui/material';

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
import { useDragSelection } from '../main/list/useDragSelection';
import ItemCard from '../table/ItemCard';
import SortingSelect from '../table/SortingSelect';
import { SortingOptions } from '../table/types';
import { useSorting, useTranslatedSortingOptions } from '../table/useSorting';
import PageWrapper from './PageWrapper';
import RecycleBinToolbar from './recycleBin/RecycleBinSelectionToolbar';

const RecycledItemsScreenContent = ({
  searchText,
}: {
  searchText: string;
}): JSX.Element => {
  const { t: translateBuilder } = useBuilderTranslation();
  const { data: recycledItems, isLoading, isError } = hooks.useRecycledItems();
  const options = useTranslatedSortingOptions();
  const { shouldDisplayItem } = useFilterItemsContext();
  const theme = useTheme();
  const { sortBy, setSortBy, ordering, setOrdering, sortFn } =
    useSorting<SortingOptions>({
      sortBy: SortingOptions.ItemUpdatedAt,
      ordering: Ordering.DESC,
    });
  const filteredData = recycledItems
    ?.filter(
      (d) =>
        shouldDisplayItem(d.type) &&
        d.name.toLowerCase().includes(searchText.toLocaleLowerCase()),
    )
    ?.sort(sortFn);
  const { selectedIds, toggleSelection } = useSelectionContext();

  const DragSelection = useDragSelection({
    adjustments: { marginTop: 70, marginLeft: theme.spacing(3) },
  });

  // render this when there is data from the query
  if (recycledItems?.length) {
    const hasSelection = selectedIds.length && filteredData?.length;
    return (
      <>
        <Stack gap={1}>
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
          {
            // render the filtered data and when it is empty display that nothing matches the search
            filteredData?.length ? (
              filteredData.map((item) => (
                <ItemCard
                  item={item}
                  onThumbnailClick={() => toggleSelection(item.id)}
                  isSelected={selectedIds.includes(item.id)}
                  showThumbnail={false}
                  allowNavigation={false}
                  footer={
                    <Stack justifyContent="right" direction="row">
                      <RestoreButton itemIds={[item.id]} />
                      <DeleteButton items={[item]} />
                    </Stack>
                  }
                />
              ))
            ) : (
              <Alert severity="info">
                {translateBuilder(BUILDER.TRASH_NO_ITEM_SEARCH, {
                  search: searchText,
                })}
              </Alert>
            )
          }
        </Stack>
        <DragSelection />
      </>
    );
  }

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (isError) {
    return <ErrorAlert id={RECYCLED_ITEMS_ERROR_ALERT_ID} />;
  }

  return (
    <Alert severity="info">{translateBuilder(BUILDER.TRASH_NO_ITEM)}</Alert>
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
      <SelectionContextProvider>
        <RecycledItemsScreenContent searchText={itemSearch.text} />
      </SelectionContextProvider>
    </PageWrapper>
  );
};

export default RecycledItemsScreen;
