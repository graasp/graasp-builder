import { Dispatch, useState } from 'react';
import { useParams } from 'react-router-dom';

import { Box, DialogActions, DialogContent, Stack } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';

import { PackedItem } from '@graasp/sdk';
import { COMMON } from '@graasp/translations';
import { Button, DraggingWrapper } from '@graasp/ui';

import { useBuilderTranslation, useCommonTranslation } from '@/config/i18n';
import { ItemLayoutMode } from '@/enums';

import { hooks, mutations } from '../../config/queryClient';
import { useLayoutContext } from '../context/LayoutContext';
import ActionsCellRenderer from '../table/ActionsCellRenderer';
import BadgesCellRenderer, {
  useItemsStatuses,
} from '../table/BadgesCellRenderer';
import ItemCard from '../table/ItemCard';
import { SortingOptions } from '../table/SortingSelect';
import ItemMenuContent from './ItemMenuContent';

const { useItem } = hooks;

export const useSorting = ({
  sortBy: s,
  ordering: o,
}: {
  sortBy?: SortingOptions;
  ordering: 'asc' | 'desc';
}): {
  sortBy?: SortingOptions;
  ordering: 'asc' | 'desc';
  setSortBy: Dispatch<SortingOptions>;
  setOrdering: Dispatch<'asc' | 'desc'>;
  sortFn: (a: PackedItem, b: PackedItem) => number;
} => {
  const [sortBy, setSortBy] = useState<SortingOptions>(s);
  const [ordering, setOrdering] = useState<'asc' | 'desc'>(o);

  const sortFn = (a: PackedItem, b: PackedItem) => {
    const f = ordering === 'asc' ? 1 : -1;
    let value = 0;
    switch (sortBy) {
      case SortingOptions.ItemName:
        value = a.name > b.name ? 1 : -1;
        break;
      case SortingOptions.ItemCreator:
        if (!a.creator) {
          value = -1;
        } else if (!b.creator) {
          value = 1;
        } else {
          value = a.creator?.name > b.creator?.name ? 1 : -1;
        }
        break;
      case SortingOptions.ItemType:
        value = a.type > b.type ? 1 : -1;
        break;
      case SortingOptions.ItemUpdatedAt:
      default:
        value = a.updatedAt > b.updatedAt ? 1 : -1;
    }

    return value * f;
  };

  return { sortBy, ordering, setSortBy, setOrdering, sortFn };
};

export type ItemsTableProps = {
  id?: string;
  items?: PackedItem[];
  showThumbnails?: boolean;
  canMove?: boolean;
  enableMoveInBetween?: boolean;
};

const ItemsTable = ({
  id: tableId = '',
  items: rows = [],
  showThumbnails = true,
  canMove = true,
  enableMoveInBetween = true,
}: ItemsTableProps): JSX.Element => {
  const [open, setOpen] = useState(false);
  const { mode } = useLayoutContext();
  const { t: translateCommon } = useCommonTranslation();
  const { t: translateBuilder } = useBuilderTranslation();
  const { data: member } = hooks.useCurrentMember();

  const itemsStatuses = useItemsStatuses({
    items: rows,
  });

  const { itemId } = useParams();

  const { data: parentItem } = useItem(itemId);

  const { mutate: reorder } = mutations.useReorderItem();
  const { mutate: moveItems } = mutations.useMoveItems();
  const { mutate: uploadItems } = mutations.useUploadFiles();
  const [moveData, setMoveData] = useState<{
    movedItem: PackedItem;
    to: PackedItem;
  }>();

  const dense = mode === ItemLayoutMode.List;

  const handleClose = () => {
    setOpen(false);
  };

  const onDropInRow = (movedItem: PackedItem | any, targetItem: PackedItem) => {
    // upload files in item
    if (movedItem.files) {
      uploadItems({
        files: movedItem.files,
        id: targetItem.id,
      });
    } else if (movedItem.id !== targetItem.id) {
      setOpen(true);
      setMoveData({ movedItem, to: targetItem });
    }
  };

  // warning: this won't work anymore with pagination!
  const onDropBetweenRow = (e: PackedItem | any, d?: PackedItem) => {
    // upload files at row
    if (e.files) {
      uploadItems({
        files: e.files,
        id: parentItem?.id,
        previousItemId: d?.id,
      });
    } else if (!itemId || !parentItem) {
      console.error('no item id defined');
    } else {
      // TODO: can d be an item?
      reorder({
        id: e.id,
        previousItemId: d?.id,
        parentItemId: parentItem.id,
      });
    }
  };

  const handleMoveItems = () => {
    if (moveData) {
      moveItems({ ids: [moveData.movedItem.id], to: moveData.to.id });
      setMoveData(undefined);
      handleClose();
    }
  };

  return (
    <>
      <DraggingWrapper
        id={tableId}
        isMovable={canMove}
        getRowId={(item) => item.id}
        renderComponent={(droppedEl, { isDragging, isOver }) => {
          if ('files' in droppedEl) {
            return (
              <Box
                sx={{
                  boxSizing: 'border-box',
                  border: '2px dashed grey',
                }}
              >
                + upload files
              </Box>
            );
          }

          return (
            <ItemCard
              dense={dense}
              item={droppedEl}
              isOver={isOver}
              isDragging={isDragging}
              showThumbnail={showThumbnails}
              renderMenuItems={ItemMenuContent({
                item: droppedEl,
                member,
              })}
              footer={
                <Stack
                  direction="row"
                  alignItems="center"
                  justifyContent="space-between"
                >
                  <BadgesCellRenderer
                    itemsStatuses={itemsStatuses}
                    data={droppedEl}
                  />
                  <ActionsCellRenderer data={droppedEl} />
                </Stack>
              }
            />
          );
        }}
        rows={rows}
        onDropBetweenRow={onDropBetweenRow}
        enableMoveInBetween={enableMoveInBetween}
        onDropInRow={onDropInRow}
      />
      <Dialog onClose={handleClose} open={open}>
        <DialogTitle>
          Confirm moving <strong>{moveData?.movedItem?.name}</strong> inside{' '}
          <strong>{moveData?.to?.name}</strong>
        </DialogTitle>

        <DialogContent>
          {translateBuilder(
            'This operation might give access to more persons than previously.\nDo you want to proceed?',
          )}
        </DialogContent>

        <DialogActions>
          <Button variant="text" onClick={handleClose}>
            {translateCommon(COMMON.CANCEL_BUTTON)}
          </Button>
          <Button onClick={handleMoveItems}>
            {translateCommon('Confirm')}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ItemsTable;
