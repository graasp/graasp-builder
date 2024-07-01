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
import { ItemLayoutMode, Ordering } from '@/enums';

import { useBuilderTranslation, useEnumsTranslation } from '../../config/i18n';
import { hooks } from '../../config/queryClient';
import { ACCESSIBLE_ITEMS_TABLE_ID } from '../../config/selectors';
import { BUILDER } from '../../langs/constants';
import SelectTypes from '../common/SelectTypes';
import { useCurrentUserContext } from '../context/CurrentUserContext';
import { useFilterItemsContext } from '../context/FilterItemsContext';
import { useLayoutContext } from '../context/LayoutContext';
import FileUploader from '../file/FileUploader';
import { useItemSearch } from '../item/ItemSearch';
import ModeButton from '../item/header/ModeButton';
import ItemsTable from '../main/ItemsTable';
import NewItemButton from '../main/NewItemButton';
import { DesktopMap } from '../map/DesktopMap';
import ShowOnlyMeButton from '../table/ShowOnlyMeButton';
import SortingSelect from '../table/SortingSelect';
import { SortingOptions, useSorting } from '../table/useSorting';

const HomeScreen = (): JSX.Element => {
  const { t: translateBuilder } = useBuilderTranslation();
  const { t: translateEnums } = useEnumsTranslation();
  const { data: currentMember } = useCurrentUserContext();
  const { itemTypes } = useFilterItemsContext();
  const [showOnlyMe, setShowOnlyMe] = useState(false);

  const { mode } = useLayoutContext();
  const { sortBy, setSortBy, ordering, setOrdering } =
    useSorting<SortingOptions>({
      sortBy: SortingOptions.ItemUpdatedAt,
      ordering: Ordering.DESC,
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
          <Stack direction="row" justifyContent="flex-end">
            <ModeButton />
          </Stack>
          <DesktopMap />
        </>
      );
    }

    if (data && data.pages.length) {
      let content = <FileUploader />;
      if (data.pages[0].data.length) {
        const totalFetchedItems = data ? data.pages.length * ITEM_PAGE_SIZE : 0;
        content = (
          <>
            <ItemsTable
              canMove={!itemSearch?.text}
              id={ACCESSIBLE_ITEMS_TABLE_ID}
              items={data.pages.flatMap(({ data: i }) => i)}
              enableMoveInBetween={false}
            />
            {!isFetching && data.pages[0].totalCount > totalFetchedItems && (
              <Stack textAlign="center" alignItems="center">
                <Button variant="outlined" onClick={fetchNextPage}>
                  {translateBuilder(BUILDER.HOME_SCREEN_LOAD_MORE_BUTTON)}
                </Button>
              </Stack>
            )}
          </>
        );
      } else if (itemTypes.length || itemSearch.text) {
        // empty data and no filtering shows drop zone
        content = (
          <>
            <Typography variant="body1" textAlign="center">
              {translateBuilder(BUILDER.ITEM_SEARCH_NOTHING_FOUND)}
            </Typography>
            {itemSearch.text && (
              <Typography variant="body1" textAlign="center">
                <strong>
                  {translateBuilder(
                    BUILDER.ITEM_SEARCH_NOTHING_FOUND_QUERY_TITLE,
                  )}
                </strong>
                : {itemSearch.text}
              </Typography>
            )}
            {itemTypes.length ? (
              <Typography variant="body1" textAlign="center">
                <strong>
                  {translateBuilder(
                    BUILDER.ITEM_SEARCH_NOTHING_FOUND_TYPES_TITLE,
                  )}
                  : {itemTypes.join(', ')}
                </strong>
              </Typography>
            ) : null}
          </>
        );
      }

      return (
        <>
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
                    options={Object.values(SortingOptions).sort((t1, t2) =>
                      translateEnums(t1).localeCompare(translateEnums(t2)),
                    )}
                  />
                )}
                <ModeButton />
              </Stack>
            </Stack>
          </Stack>
          {content}
          {data && isFetching && (
            <Box sx={{ width: '100%' }}>
              <LinearProgress />
            </Box>
          )}
          <NewItemButton key="newButton" />
        </>
      );
    }

    if (isLoading) {
      return (
        <>
          <Skeleton variant="rounded" height={40} />
          <Skeleton variant="rounded" height={30} />
          <Skeleton variant="rounded" height={30} />
          <Stack spacing={2} mt={2}>
            <Skeleton variant="rounded" height={60} />
            <Skeleton variant="rounded" height={60} />
            <Skeleton variant="rounded" height={60} />
            <Skeleton variant="rounded" height={60} />
            <Skeleton variant="rounded" height={60} />
            <Skeleton variant="rounded" height={60} />
          </Stack>
        </>
      );
    }

    return (
      <Alert severity="error">{translateBuilder(BUILDER.ERROR_MESSAGE)}</Alert>
    );
  };

  return (
    <>
      <Helmet>
        <title>{translateBuilder(BUILDER.MY_ITEMS_TITLE)}</title>
      </Helmet>
      <Container sx={{ my: 3 }}>
        <Stack direction="column" gap={2}>
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
        </Stack>
      </Container>
    </>
  );
};

export default HomeScreen;
