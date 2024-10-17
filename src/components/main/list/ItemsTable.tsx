import { useState } from 'react';
import { Trans } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

import { DialogActions, DialogContent, Skeleton } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';

import { DiscriminatedItem, ItemType, PackedItem } from '@graasp/sdk';
import { COMMON, FAILURE_MESSAGES } from '@graasp/translations';
import { Button, DraggingWrapper } from '@graasp/ui';

import {
  useBuilderTranslation,
  useCommonTranslation,
  useEnumsTranslation,
  useMessagesTranslation,
} from '@/config/i18n';
import { BUILDER } from '@/langs/constants';

import { hooks, mutations } from '../../../config/queryClient';
import { useUploadWithProgress } from '../../hooks/uploadWithProgress';
import { useItemsStatuses } from '../../table/Badges';
import ItemsTableCard from './ItemsTableCard';

const { useItem } = hooks;

export type ItemsTableProps = {
  id?: string;
  items?: PackedItem[];
  showThumbnail?: boolean;
  canMove?: boolean;
  enableMoveInBetween?: boolean;
  onCardClick?: (id: DiscriminatedItem['id']) => void;
  selectedIds?: string[];
  onMove?: () => void;
};

const ItemsTable = ({
  id: tableId = '',
  items: rows = [],
  showThumbnail = true,
  canMove = true,
  enableMoveInBetween = true,
  selectedIds = [],
  onCardClick,
  onMove,
}: ItemsTableProps): JSX.Element => {
  const [open, setOpen] = useState(false);
  const { t: translateCommon } = useCommonTranslation();
  const { t: translateBuilder } = useBuilderTranslation();
  const { t: translateMessage } = useMessagesTranslation();
  const { t: translateEnums } = useEnumsTranslation();

  const { itemId } = useParams();

  const { data: parentItem } = useItem(itemId);

  const { update, close } = useUploadWithProgress();
  const { mutateAsync: reorder } = mutations.useReorderItem();
  const [movingId, setMovingId] = useState<PackedItem['id'] | undefined>();
  const { mutate: moveItems } = mutations.useMoveItems();
  const { mutateAsync: uploadItems } = mutations.useUploadFiles();
  const [moveData, setMoveData] = useState<{
    movedItems: PackedItem[];
    to: PackedItem;
  }>();

  const handleClose = () => {
    setOpen(false);
  };

  const itemsStatuses = useItemsStatuses({
    items: rows,
  });

  const onDropInRow = (
    movedItem: PackedItem | { files: File[] },
    targetItem: PackedItem,
  ) => {
    // prevent drop in non-folder item
    if (targetItem.type !== ItemType.FOLDER) {
      toast.error(
        translateBuilder(BUILDER.MOVE_IN_NON_FOLDER_ERROR_MESSAGE, {
          type: translateEnums(targetItem.type),
        }),
      );
      return;
    }

    // upload files in item
    if ('files' in movedItem) {
      uploadItems({
        files: movedItem.files,
        id: targetItem.id,
        onUploadProgress: update,
      })
        .then(() => {
          close();
        })
        .catch((e) => {
          close(e);
        });
      return;
    }

    // silent error, happens when you want to cancel the operation
    if (movedItem.id === targetItem.id) {
      console.error('cannot move target into itself');
      return;
    }

    // cannot move item into itself, or target cannot be part of selection if moving selection
    if (
      selectedIds.includes(movedItem?.id) &&
      selectedIds.includes(targetItem.id)
    ) {
      toast.error(translateMessage(FAILURE_MESSAGES.INVALID_MOVE_TARGET));
      return;
    }

    let movedItems: PackedItem[] = [];
    // use selected ids on drag move if moved item is part of selected ids
    if (selectedIds.includes(movedItem?.id)) {
      movedItems = rows.filter(({ id }) => selectedIds.includes(id));
    } else if (movedItem) {
      movedItems = [movedItem];
    }
    setMoveData({ movedItems, to: targetItem });
    setOpen(true);
  };

  // warning: this won't work anymore with pagination!
  const onDropBetweenRow = (
    el: PackedItem | { files: File[] },
    previousItem?: PackedItem,
  ) => {
    // upload files at row
    if ('files' in el) {
      uploadItems({
        files: el.files,
        id: parentItem?.id,
        previousItemId: previousItem?.id,
        onUploadProgress: update,
      })
        .then(() => {
          close();
        })
        .catch((e) => {
          close(e);
        });
    } else if (!itemId || !parentItem) {
      console.error('cannot move in root');
      toast.error(BUILDER.ERROR_MESSAGE);
    } else {
      const { id } = el;
      setMovingId(id);
      reorder({
        id,
        previousItemId: previousItem?.id,
        parentItemId: parentItem.id,
      }).finally(() => {
        setMovingId(undefined);
      });
    }
  };

  const handleMoveItems = () => {
    if (moveData) {
      moveItems({ items: moveData.movedItems, to: moveData.to.id });
      setMoveData(undefined);
      handleClose();
      onMove?.();
    }
  };

  const isSelected = (droppedEl: PackedItem | { files: File[] }): boolean =>
    'id' in droppedEl ? selectedIds.includes(droppedEl.id) : false;

  return (
    <>
      <DraggingWrapper
        id={tableId}
        isMovable={(item) => movingId !== item.id && canMove}
        getRowId={(row) => row.id}
        renderComponent={(droppedEl, y) => (
          <ItemsTableCard
            item={droppedEl}
            isDragging={y.isDragging}
            isOver={y.isOver}
            isMovable={y.isMovable}
            enableMoveInBetween={enableMoveInBetween}
            itemsStatuses={itemsStatuses}
            showThumbnail={showThumbnail}
            isSelected={isSelected(droppedEl)}
            onThumbnailClick={() => {
              if ('id' in droppedEl) {
                onCardClick?.(droppedEl.id);
              }
            }}
          />
        )}
        rows={rows}
        onDropBetweenRow={onDropBetweenRow}
        enableMoveInBetween={enableMoveInBetween}
        onDropInRow={onDropInRow}
      />
      <Dialog onClose={handleClose} open={open}>
        {moveData ? (
          <>
            <DialogTitle>
              <Trans
                t={translateBuilder}
                i18nKey={BUILDER.MOVE_CONFIRM_TITLE}
                values={{
                  count: moveData.movedItems.length,
                  targetName: moveData.to.name,
                }}
                components={{ 1: <strong /> }}
              />
            </DialogTitle>

            <DialogContent>
              {translateBuilder(BUILDER.MOVE_WARNING)}
              <ul>
                {moveData.movedItems.map(({ name, id }) => (
                  <li key={id}>{name}</li>
                ))}
              </ul>
            </DialogContent>
          </>
        ) : (
          <Skeleton />
        )}

        <DialogActions>
          <Button variant="text" onClick={handleClose}>
            {translateCommon(COMMON.CANCEL_BUTTON)}
          </Button>
          <Button onClick={handleMoveItems}>
            {translateBuilder(BUILDER.MOVE_BUTTON)}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ItemsTable;
