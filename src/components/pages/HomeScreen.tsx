import { useState } from 'react';
import { Helmet } from 'react-helmet';

import {
  Alert,
  Box,
  Container,
  LinearProgress,
  Skeleton,
  Stack,
  Typography,
} from '@mui/material';

import { Button } from '@graasp/ui';

import { ITEM_PAGE_SIZE } from '@/config/constants';
import { ShowOnlyMeChangeType } from '@/config/types';
import { ItemLayoutMode } from '@/enums';

import { useBuilderTranslation } from '../../config/i18n';
import { hooks } from '../../config/queryClient';
import { ACCESSIBLE_ITEMS_TABLE_ID } from '../../config/selectors';
import { BUILDER } from '../../langs/constants';
import { useCurrentUserContext } from '../context/CurrentUserContext';
import { useFilterItemsContext } from '../context/FilterItemsContext';
import { useLayoutContext } from '../context/LayoutContext';
import { useItemSearch } from '../item/ItemSearch';
import MapView from '../item/MapView';
import ModeButton from '../item/header/ModeButton';
import ItemsTable, { useSorting } from '../main/ItemsTable';
import NewItemButton from '../main/NewItemButton';
import TableToolbar from '../main/TableToolbar';
import { SortingOptions } from '../table/SortingSelect';

const HomeScreen = (): JSX.Element => {
  const { t: translateBuilder } = useBuilderTranslation();
  const { data: currentMember } = useCurrentUserContext();
  const { itemTypes } = useFilterItemsContext();
  const [showOnlyMe, setShowOnlyMe] = useState(false);

  const { mode } = useLayoutContext();
  const { sortBy, setSortBy, ordering, setOrdering } = useSorting({
    sortBy: SortingOptions.ItemUpdatedAt,
    ordering: 'desc',
  });
  const itemSearch = useItemSearch();
  const { data, fetchNextPage, isLoading, isFetching } =
    hooks.useInfiniteAccessibleItems(
      {
        // todo: in the future this can be any member from creators
        creatorId: showOnlyMe ? currentMember?.id : undefined,
        name: itemSearch.text,
        sortBy,
        ordering,
        types: itemTypes,
      },
      // todo: adapt page size given the user window height
      { pageSize: ITEM_PAGE_SIZE },
    );

  const onShowOnlyMeChange: ShowOnlyMeChangeType = (checked) => {
    setShowOnlyMe(checked);
  };

  const renderContent = () => {
    if (mode === ItemLayoutMode.Map) {
      return (
        <>
          <ModeButton />
          <MapView height="65vh" />
        </>
      );
    }
    if (data && data.pages.length) {
      return (
        <>
          <TableToolbar
            onShowOnlyMeChange={onShowOnlyMeChange}
            showOnlyMe={showOnlyMe}
            sortBy={sortBy}
            setSortBy={setSortBy}
            ordering={ordering}
            setOrdering={setOrdering}
          />
          {data.pages[0].data.length ? (
            <ItemsTable
              canMove={!itemSearch?.text}
              id={ACCESSIBLE_ITEMS_TABLE_ID}
              items={data.pages.flatMap(({ data: i }) => i)}
              enableMoveInBetween={false}
            />
          ) : (
            // empty data shows drop zone
            <DropzoneHelper />
          )}
        </>
      );
    }

    if (isLoading) {
      // TODO: add filter skeleton !!!
      return (
        <Stack spacing={2} mt={2}>
          <Skeleton variant="rounded" height={60} />
          <Skeleton variant="rounded" height={60} />
          <Skeleton variant="rounded" height={60} />
          <Skeleton variant="rounded" height={60} />
          <Skeleton variant="rounded" height={60} />
          <Skeleton variant="rounded" height={60} />
        </Stack>
      );
    }

    return <Alert severity="error">An error happened</Alert>;
  };

  const totalFetchedItems = data ? data.pages.length * ITEM_PAGE_SIZE : 0;
  return (
    <>
      <Helmet>
        <title>{translateBuilder(BUILDER.MY_ITEMS_TITLE)}</title>
      </Helmet>
      <Container sx={{ my: 3 }}>
        <Stack direction="row" justifyContent="space-between" spacing={1}>
          <Typography
            variant="h2"
            component="h1"
            sx={{ wordWrap: 'break-word' }}
          >
            {translateBuilder(BUILDER.MY_ITEMS_TITLE)}
          </Typography>
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="flex-end"
            spacing={1}
          >
            {itemSearch.input}
          </Stack>
        </Stack>

        {renderContent()}

        {data && isFetching && (
          <Box sx={{ width: '100%' }}>
            <LinearProgress />
          </Box>
        )}
        {!isFetching &&
          data &&
          Boolean(data.pages.length) &&
          data.pages[0].totalCount > totalFetchedItems && (
            <Stack textAlign="center" alignItems="center">
              <Button variant="outlined" onClick={fetchNextPage}>
                {translateBuilder('Load More')}
              </Button>
            </Stack>
          )}
        {mode !== ItemLayoutMode.Map && <NewItemButton key="newButton" />}
      </Container>
    </>
  );
};

export default HomeScreen;
