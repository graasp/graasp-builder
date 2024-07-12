import { Alert, Stack, Typography } from '@mui/material';

import {
  PackedItem,
  PermissionLevel,
  PermissionLevelCompare,
} from '@graasp/sdk';
import { Loader } from '@graasp/ui';

import { useBuilderTranslation, useEnumsTranslation } from '@/config/i18n';
import { hooks } from '@/config/queryClient';
import {
  ITEM_SCREEN_ERROR_ALERT_ID,
  buildItemsTableId,
} from '@/config/selectors';
import { ItemLayoutMode, Ordering } from '@/enums';
import { BUILDER } from '@/langs/constants';

import ErrorAlert from '../common/ErrorAlert';
import SelectTypes from '../common/SelectTypes';
import { useFilterItemsContext } from '../context/FilterItemsContext';
import { useLayoutContext } from '../context/LayoutContext';
import FileUploader from '../file/FileUploader';
import ItemsTable from '../main/ItemsTable';
import NewItemButton from '../main/NewItemButton';
import { DesktopMap } from '../map/DesktopMap';
import SortingSelect from '../table/SortingSelect';
import { SortingOptionsForFolder } from '../table/types';
import { useSorting } from '../table/useSorting';
import FolderDescription from './FolderDescription';
import { useItemSearch } from './ItemSearch';
import ModeButton from './header/ModeButton';

/**
 * Helper component to render typed folder items
 */
const FolderContent = ({ item }: { item: PackedItem }): JSX.Element => {
  const { shouldDisplayItem } = useFilterItemsContext();
  const { t: translateBuilder } = useBuilderTranslation();
  const { t: translateEnums } = useEnumsTranslation();
  const { mode } = useLayoutContext();

  const enableEditing = item.permission
    ? PermissionLevelCompare.lte(PermissionLevel.Write, item.permission)
    : false;

  const {
    data: children,
    isLoading,
    isError,
  } = hooks.useChildren(item.id, {
    ordered: true,
  });

  const itemSearch = useItemSearch();
  const { ordering, setOrdering, setSortBy, sortBy, sortFn } =
    useSorting<SortingOptionsForFolder>({
      sortBy: SortingOptionsForFolder.Order,
      ordering: Ordering.ASC,
    });

  // TODO: use hook's filter when available
  const folderChildren = children
    ?.filter(
      (f) =>
        shouldDisplayItem(f.type) &&
        f.name.toLowerCase().includes(itemSearch.text.toLowerCase()),
    )
    .sort(sortFn);

  if (children?.length) {
    return (
      <>
        <Stack direction="row" justifyContent="space-between" spacing={1}>
          <Typography
            variant="h2"
            component="h1"
            sx={{ wordWrap: 'break-word' }}
          >
            {item.name}
          </Typography>
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="flex-end"
            spacing={1}
          >
            {itemSearch.input}
            <NewItemButton
              key="newButton"
              size="medium"
              // add new items at the end of the list
              previousItemId={children[children.length - 1]?.id}
            />
          </Stack>
        </Stack>
        <FolderDescription itemId={item.id} />
        {mode === ItemLayoutMode.Map ? (
          <>
            <ModeButton />
            <DesktopMap parentId={item.id} />
          </>
        ) : (
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
                      ordering={ordering}
                      sortBy={sortBy}
                      setSortBy={setSortBy}
                      options={Object.values(SortingOptionsForFolder).sort(
                        (t1, t2) =>
                          translateEnums(t1).localeCompare(translateEnums(t2)),
                      )}
                      setOrdering={setOrdering}
                    />
                  )}
                  <ModeButton />
                </Stack>
              </Stack>
            </Stack>
            <ItemsTable
              enableMoveInBetween={sortBy === SortingOptionsForFolder.Order}
              id={buildItemsTableId(item.id)}
              items={folderChildren ?? []}
            />
            {/* do not show new button on search or reset */}
            {Boolean(enableEditing && !itemSearch.text) && (
              <Stack alignItems="center" mb={2}>
                <NewItemButton
                  type="icon"
                  key="newButton"
                  // add new items at the end of the list
                  previousItemId={children[children.length - 1]?.id}
                />
              </Stack>
            )}
          </>
        )}
      </>
    );
  }

  if (isLoading) {
    return <Loader />;
  }

  if (isError) {
    return <ErrorAlert id={ITEM_SCREEN_ERROR_ALERT_ID} />;
  }

  if (
    item.permission &&
    PermissionLevelCompare.gte(item.permission, PermissionLevel.Write)
  ) {
    return (
      <FileUploader
        buttons={
          <NewItemButton
            key="newButton"
            // add new items at the end of the list
            previousItemId={children[children.length - 1]?.id}
          />
        }
      />
    );
  }

  return (
    <Alert severity="info">
      {translateBuilder(BUILDER.ITEMS_TABLE_EMPTY_MESSAGE)}
    </Alert>
  );
};

export default FolderContent;
