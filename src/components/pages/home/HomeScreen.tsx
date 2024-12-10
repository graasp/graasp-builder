import { useState } from 'react';

import {
  Alert,
  Box,
  Container,
  LinearProgress,
  Button as MuiButton,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';

import { Button } from '@graasp/ui';

import { NewFolderButton } from '@/components/item/form/folder/NewFolderButton';
import LoadingScreen from '@/components/layout/LoadingScreen';
import {
  SelectionContextProvider,
  useSelectionContext,
} from '@/components/main/list/SelectionContext';
import {
  DragContainerStack,
  useDragSelection,
} from '@/components/main/list/useDragSelection';
import { ITEM_PAGE_SIZE } from '@/config/constants';
import { ShowOnlyMeChangeType } from '@/config/types';
import { ItemLayoutMode, Ordering } from '@/enums';

import {
  useBuilderTranslation,
  useEnumsTranslation,
} from '../../../config/i18n';
import { hooks } from '../../../config/queryClient';
import { ACCESSIBLE_ITEMS_TABLE_ID } from '../../../config/selectors';
import { BUILDER } from '../../../langs/constants';
import SelectTypes from '../../common/SelectTypes';
import { useFilterItemsContext } from '../../context/FilterItemsContext';
import { useLayoutContext } from '../../context/LayoutContext';
import FileUploader from '../../file/FileUploader';
import { useItemSearch } from '../../item/ItemSearch';
import ModeButton from '../../item/header/ModeButton';
import NewItemButton from '../../main/NewItemButton';
import ItemsTable from '../../main/list/ItemsTable';
import { DesktopMap } from '../../map/DesktopMap';
import ShowOnlyMeButton from '../../table/ShowOnlyMeButton';
import SortingSelect from '../../table/SortingSelect';
import { SortingOptions } from '../../table/types';
import { useSorting } from '../../table/useSorting';
import NoItemFilters from '../NoItemFilters';
import PageWrapper from '../PageWrapper';
import HomeSelectionToolbar from './HomeSelectionToolbar';

const CONTAINER_ID = 'home-items-container';

const HomeScreenContent = ({ searchText }: { searchText: string }) => {
  const { t: translateBuilder } = useBuilderTranslation();
  const { t: translateEnums } = useEnumsTranslation();
  const { data: currentMember } = hooks.useCurrentMember();
  const { itemTypes } = useFilterItemsContext();
  const [showOnlyMe, setShowOnlyMe] = useState(false);

  const { selectedIds, toggleSelection, clearSelection } =
    useSelectionContext();
  const { mode } = useLayoutContext();
  const { sortBy, setSortBy, ordering, setOrdering } =
    useSorting<SortingOptions>({
      sortBy: SortingOptions.ItemUpdatedAt,
      ordering: Ordering.DESC,
    });
  const { data, fetchNextPage, isLoading, isFetching } =
    hooks.useInfiniteAccessibleItems(
      {
        // todo: in the future this can be any member from creators
        creatorId: showOnlyMe ? currentMember?.id : undefined,
        sortBy,
        ordering,
        types: itemTypes,
        keywords: searchText,
      },
      // todo: adapt page size given the user window height
      { pageSize: ITEM_PAGE_SIZE },
    );

  const DragSelection = useDragSelection({ containerId: CONTAINER_ID });

  const onShowOnlyMeChange: ShowOnlyMeChangeType = (checked) => {
    setShowOnlyMe(checked);
  };

  if (mode === ItemLayoutMode.Map) {
    return (
      <>
        <Stack direction="row" justifyContent="flex-end">
          <ModeButton />
        </Stack>
        <DesktopMap />
      </>
    );
  }

  if (data?.pages?.length) {
    // default show upload zone
    let content = (
      <Box mt={2}>
        <FileUploader buttons={<NewItemButton />} />
      </Box>
    );

    if (data.pages[0].data.length) {
      const totalFetchedItems = data
        ? data.pages.map(({ data: d }) => d.length).reduce((a, b) => a + b, 0)
        : 0;
      content = (
        <DragContainerStack id={CONTAINER_ID}>
          <ItemsTable
            canMove={!searchText}
            id={ACCESSIBLE_ITEMS_TABLE_ID}
            items={data.pages.flatMap(({ data: i }) => i)}
            enableMoveInBetween={false}
            onCardClick={toggleSelection}
            selectedIds={selectedIds}
            onMove={clearSelection}
          />
          {!isFetching && data.pages[0].totalCount > totalFetchedItems && (
            <Stack textAlign="center" alignItems="center">
              <Button variant="outlined" onClick={fetchNextPage} role="feed">
                {translateBuilder(BUILDER.HOME_SCREEN_LOAD_MORE_BUTTON)}
              </Button>
            </Stack>
          )}
          {!isFetching && data.pages[0].totalCount === totalFetchedItems && (
            // avoids button fullwidth
            <Stack alignItems="center" mb={2}>
              <NewItemButton type="icon" />
            </Stack>
          )}
        </DragContainerStack>
      );
    } else if (itemTypes.length || searchText) {
      content = <NoItemFilters searchText={searchText} />;
    }

    const sortingOptions = Object.values(SortingOptions).sort((t1, t2) =>
      translateEnums(t1).localeCompare(translateEnums(t2)),
    );

    return (
      <>
        {DragSelection}
        <Stack
          alignItems="space-between"
          direction="column"
          mt={2}
          gap={1}
          width="100%"
        >
          <Stack spacing={1}>
            <ShowOnlyMeButton
              onClick={onShowOnlyMeChange}
              enabled={showOnlyMe}
            />
          </Stack>

          {selectedIds.length ? (
            <HomeSelectionToolbar
              items={data.pages.flatMap(({ data: i }) => i)}
            />
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
                  <SortingSelect<SortingOptions>
                    sortBy={sortBy}
                    setSortBy={setSortBy}
                    ordering={ordering}
                    setOrdering={setOrdering}
                    options={sortingOptions}
                  />
                )}
                <ModeButton />
              </Stack>
            </Stack>
          )}
        </Stack>
        <Stack height="100%">
          {content}
          {data && isFetching && (
            <Box sx={{ width: '100%' }}>
              <LinearProgress />
            </Box>
          )}
        </Stack>
      </>
    );
  }

  if (isLoading) {
    return <LoadingScreen chipsPlaceholder />;
  }

  return (
    <Alert severity="error">{translateBuilder(BUILDER.ERROR_MESSAGE)}</Alert>
  );
};

const HomeScreen = (): JSX.Element => {
  const { t: translateBuilder } = useBuilderTranslation();
  const { data: currentMember } = hooks.useCurrentMember();
  const theme = useTheme();
  const isMd = useMediaQuery(theme.breakpoints.up('md'));

  const itemSearch = useItemSearch();

  if (currentMember) {
    return (
      <PageWrapper
        title={translateBuilder(BUILDER.MY_ITEMS_TITLE)}
        options={
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="flex-end"
            spacing={1}
          >
            {itemSearch.input}
            <NewFolderButton type={isMd ? 'button' : 'icon'} />
            <NewItemButton
              key="newButton"
              size="medium"
              type={isMd ? 'button' : 'icon'}
            />
          </Stack>
        }
      >
        <SelectionContextProvider>
          <HomeScreenContent searchText={itemSearch.text} />
        </SelectionContextProvider>
      </PageWrapper>
    );
  }

  // not logged in - redirection
  return (
    <Stack height="100%" justifyContent="center" alignItems="center">
      <Container maxWidth="md">
        <Alert severity="warning">
          <Typography textAlign="right">
            {translateBuilder(BUILDER.REDIRECTION_TEXT)}
          </Typography>
          <MuiButton variant="text" sx={{ textTransform: 'none' }}>
            {translateBuilder(BUILDER.REDIRECTION_BUTTON)}
          </MuiButton>
        </Alert>
      </Container>
    </Stack>
  );
};

export default HomeScreen;
