import { Alert, Stack, Typography } from '@mui/material';

import { Button } from '@graasp/ui';

import { ITEM_PAGE_SIZE } from '@/config/constants';

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
import PageWrapper from './PageWrapper';
import RecycleBinToolbar from './recycleBin/RecycleBinSelectionToolbar';

const CONTAINER_ID = 'recycle-items-container';

const RecycledItemsScreenContent = (): JSX.Element => {
  const { t: translateBuilder } = useBuilderTranslation();

  const { data, fetchNextPage, isLoading, isFetching } =
    hooks.useInfiniteOwnRecycledItems(
      // todo: adapt page size given the user window height
      { pageSize: ITEM_PAGE_SIZE },
    );

  const { selectedIds, toggleSelection } = useSelectionContext();

  const DragSelection = useDragSelection({ containerId: CONTAINER_ID });

  // render this when there is data from the query
  if (data?.pages?.length) {
    if (data.pages[0].data.length) {
      const fetchedItems = data.pages.flatMap((p) => p.data);

      const totalFetchedItems = fetchedItems.length;

      const hasSelection = Boolean(selectedIds.length && fetchedItems.length);
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
                <RecycleBinToolbar items={fetchedItems} />
              ) : (
                <Typography variant="body1">
                  {translateBuilder(BUILDER.TRASH_COUNT, {
                    count: data.pages[0].totalCount,
                  })}
                </Typography>
              )}
            </Stack>
            <DragContainerStack id={CONTAINER_ID}>
              {fetchedItems.map((item) => (
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
    return (
      <Alert severity="info">{translateBuilder(BUILDER.TRASH_NO_ITEM)}</Alert>
    );
  }

  if (isLoading) {
    return <LoadingScreen />;
  }

  return <ErrorAlert id={RECYCLED_ITEMS_ERROR_ALERT_ID} />;
};

const RecycledItemsScreen = (): JSX.Element | null => {
  const { t: translateBuilder } = useBuilderTranslation();

  return (
    <PageWrapper
      title={translateBuilder(BUILDER.RECYCLE_BIN_TITLE)}
      id={RECYCLED_ITEMS_ROOT_CONTAINER}
    >
      <SelectionContextProvider>
        <RecycledItemsScreenContent />
      </SelectionContextProvider>
    </PageWrapper>
  );
};

export default RecycledItemsScreen;
