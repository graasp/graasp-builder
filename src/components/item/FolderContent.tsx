import { Stack, Typography } from '@mui/material';

import {
  PackedItem,
  PermissionLevel,
  PermissionLevelCompare,
} from '@graasp/sdk';
import { Loader } from '@graasp/ui';

import { useBuilderTranslation } from '@/config/i18n';
import { hooks } from '@/config/queryClient';
import {
  ITEM_SCREEN_ERROR_ALERT_ID,
  buildItemsTableId,
} from '@/config/selectors';
import { ItemLayoutMode } from '@/enums';

import ErrorAlert from '../common/ErrorAlert';
import { useFilterItemsContext } from '../context/FilterItemsContext';
import { useLayoutContext } from '../context/LayoutContext';
import FileUploader from '../file/FileUploader';
import ItemsTable, { useSorting } from '../main/ItemsTable';
import NewItemButton from '../main/NewItemButton';
import TableToolbar from '../main/TableToolbar';
import FolderDescription from './FolderDescription';
import { useItemSearch } from './ItemSearch';
import MapView from './MapView';
import ModeButton from './header/ModeButton';

/**
 * Helper component to render typed folder items
 */
const FolderContent = ({
  item,
  enableEditing,
}: {
  item: PackedItem;
  enableEditing: boolean;
}): JSX.Element => {
  const { shouldDisplayItem } = useFilterItemsContext();
  const { t: translateBuilder } = useBuilderTranslation();
  const { mode } = useLayoutContext();

  const {
    data: children,
    isLoading,
    isError,
  } = hooks.useChildren(item.id, {
    ordered: true,
  });

  const itemSearch = useItemSearch();
  const { ordering, setOrdering } = useSorting({
    ordering: 'desc',
  });

  // TODO: use hook's filter when available
  const folderChildren = children?.filter(
    (f) => shouldDisplayItem(f.type) && f.name.includes(itemSearch.text),
  );

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
          </Stack>
        </Stack>
        <FolderDescription itemId={item.id} />
        {mode === ItemLayoutMode.Map && (
          <>
            <ModeButton />
            <MapView parentId={item.id} height="65vh" />
          </>
        )}
        {mode !== ItemLayoutMode.Map && (
          <>
            <TableToolbar ordering={ordering} setOrdering={setOrdering} />
            <ItemsTable
              id={buildItemsTableId(item.id)}
              items={folderChildren ?? []}
            />
          </>
        )}
        {enableEditing && mode !== ItemLayoutMode.Map && (
          <NewItemButton
            key="newButton"
            // add new items at the end of the list
            previousItemId={children[children.length - 1]?.id}
          />
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
    return <FileUploader />;
  }

  return <Typography>{translateBuilder('No item')}</Typography>;
};

export default FolderContent;
