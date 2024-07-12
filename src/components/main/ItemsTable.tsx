import { useState } from 'react';
import { Trans } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

import { DialogActions, DialogContent, Skeleton } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';

import { ItemType, PackedItem } from '@graasp/sdk';
import { COMMON } from '@graasp/translations';
import { Button, DraggingWrapper } from '@graasp/ui';

import {
  useBuilderTranslation,
  useCommonTranslation,
  useEnumsTranslation,
} from '@/config/i18n';
import { BUILDER } from '@/langs/constants';

import { hooks, mutations } from '../../config/queryClient';
import { useUploadWithProgress } from '../hooks/uploadWithProgress';
import { useItemsStatuses } from '../table/Badges';
import ItemsTableCard from './ItemsTableCard';

const { useItem } = hooks;

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
  const { t: translateCommon } = useCommonTranslation();
  const { t: translateBuilder } = useBuilderTranslation();
  const { t: translateEnums } = useEnumsTranslation();

  const { itemId } = useParams();

  const { data: parentItem } = useItem(itemId);

  const { update, close } = useUploadWithProgress();
  const { mutateAsync: reorder } = mutations.useReorderItem();
  const [movingId, setMovingId] = useState<PackedItem['id'] | undefined>();
  const { mutate: moveItems } = mutations.useMoveItems();
  const { mutateAsync: uploadItems } = mutations.useUploadFiles();
  const [moveData, setMoveData] = useState<{
    movedItem: PackedItem;
    to: PackedItem;
  }>();

  const handleClose = () => {
    setOpen(false);
  };

  const itemsStatuses = useItemsStatuses({
    items: rows,
  });

  const onDropInRow = (movedItem: PackedItem | any, targetItem: PackedItem) => {
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
    if (movedItem.files) {
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
    } else if (movedItem.id !== targetItem.id) {
      setOpen(true);
      setMoveData({ movedItem, to: targetItem });
    }
  };

  // warning: this won't work anymore with pagination!
  const onDropBetweenRow = (
    { files, id }: PackedItem | any,
    previousItem?: PackedItem,
  ) => {
    // upload files at row
    if (files) {
      uploadItems({
        files,
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
      moveItems({ items: [moveData.movedItem], to: moveData.to.id });
      setMoveData(undefined);
      handleClose();
    }
  };

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
            showThumbnails={showThumbnails}
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
                  name: moveData.movedItem.name,
                  targetName: moveData.to.name,
                }}
                components={{ 1: <strong /> }}
              />
            </DialogTitle>

            <DialogContent>
              {translateBuilder(BUILDER.MOVE_WARNING, {
                name: moveData.movedItem.name,
              })}
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
