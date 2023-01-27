import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';

import { useState } from 'react';

import { ItemType } from '@graasp/sdk';
import { BUILDER } from '@graasp/translations';
import { Button, DynamicTreeView, Loader } from '@graasp/ui';

import { TREE_VIEW_MAX_WIDTH } from '../../config/constants';
import { useBuilderTranslation } from '../../config/i18n';
import { hooks } from '../../config/queryClient';
import {
  TREE_MODAL_CONFIRM_BUTTON_ID,
  TREE_MODAL_MY_ITEMS_ID,
  TREE_MODAL_SHARED_ITEMS_ID,
  buildTreeItemId,
} from '../../config/selectors';
import { TREE_PREVENT_SELECTION } from '../../enums';
import { getParentsIdsFromPath } from '../../utils/item';
import CancelButton from '../common/CancelButton';

const dialogId = 'simple-dialog-title';
const { useItem, useItems, useOwnItems, useChildren, useSharedItems } = hooks;

type Props = {
  // we use id for shortcut, and ids for multiple operations (copy, delete...)
  onConfirm: (args: { id?: string[]; ids?: string[]; to: string }) => void;
  onClose: (ags: { id: null | string; open: boolean }) => void;
  title: string;
  prevent?: string; // TREE_PREVENT_SELECTION
  itemIds?: string[];
  open: boolean;
};

const TreeModal = ({
  itemIds,
  title,
  onClose,
  onConfirm,
  prevent = TREE_PREVENT_SELECTION.NONE,

  open = false,
}: Props): JSX.Element => {
  const { t: translateBuilder } = useBuilderTranslation();
  const { data: ownItems, isLoading: isOwnItemsLoading } = useOwnItems();
  // todo: get only shared items with write/admin rights
  // otherwise choosing an item without the write rights will result in an error
  const { data: sharedItems, isLoading: isSharedItemsLoading } =
    useSharedItems();
  const [selectedId, setSelectedId] = useState(null);
  const { data: items, isLoading: isItemLoading } = useItems(itemIds);

  // build the expanded item ids list for a given tree (with treeRootId as id)
  // by default, we expand all parents of items
  // all other tree roots should be closed
  const buildExpandedItems = (treeRootId) => {
    if (!items || items.isEmpty()) {
      return [];
    }

    // suppose all items are in the same parent
    const parentIds = getParentsIdsFromPath(items.first().path) || [];
    if (!parentIds.length) {
      return [];
    }

    // return expanded list depending current root id
    // define root id depending on whether is the root parent is in the owned items
    const rootItemId = parentIds[0];
    const isRootItemOwned = Boolean(
      ownItems.find(({ id }) => id === rootItemId),
    );
    const itemRootId = isRootItemOwned
      ? TREE_MODAL_MY_ITEMS_ID
      : TREE_MODAL_SHARED_ITEMS_ID;

    // trees root not being treeRootId should be closed
    if (treeRootId !== itemRootId) {
      return [];
    }

    // return expanded ids
    const newExpandedItems = [treeRootId, ...parentIds];
    return newExpandedItems;
  };

  if (isOwnItemsLoading || isSharedItemsLoading || isItemLoading) {
    return <Loader />;
  }

  // compute whether the given id tree item is disabled
  // it depends on the prevent mode and the previous items
  const isTreeItemDisabled = ({ itemId: iId, parentIsDisabled }) => {
    switch (prevent) {
      case TREE_PREVENT_SELECTION.SELF_AND_CHILDREN:
        // if the previous item is disabled, its children will be disabled
        // and prevent selection on self
        return parentIsDisabled || itemIds.find((x) => x === iId);
      case TREE_PREVENT_SELECTION.NONE:
      default:
        return false;
    }
  };

  const handleClose = () => {
    onClose({ id: null, open: false });
  };

  const onClickConfirm = () => {
    onConfirm({ ids: itemIds, to: selectedId });
    handleClose();
  };

  const onTreeItemSelect = (nodeId) => {
    if (selectedId === nodeId) {
      setSelectedId(null);
    } else {
      setSelectedId(nodeId);
    }
  };

  const isFolder = (i) => i.type === ItemType.FOLDER;

  // compute tree only when the modal is open
  const tree = !open ? null : (
    <>
      <DynamicTreeView
        id={TREE_MODAL_MY_ITEMS_ID}
        rootSx={{
          flexGrow: 1,
          maxWidth: TREE_VIEW_MAX_WIDTH,
        }}
        selectedId={selectedId}
        initialExpendedItems={buildExpandedItems(TREE_MODAL_MY_ITEMS_ID)}
        items={ownItems}
        onTreeItemSelect={onTreeItemSelect}
        useChildren={useChildren}
        useItem={useItem}
        showCheckbox
        rootLabel={translateBuilder(BUILDER.ITEMS_TREE_OWN_ITEMS_LABEL)}
        rootId={TREE_MODAL_MY_ITEMS_ID}
        showItemFilter={isFolder}
        shouldFetchChildrenForItem={isFolder}
        isTreeItemDisabled={isTreeItemDisabled}
        // todo: change graasp-ui
        buildTreeItemClass={buildTreeItemId as any}
      />
      <DynamicTreeView
        id={TREE_MODAL_SHARED_ITEMS_ID}
        rootSx={{
          flexGrow: 1,
          maxWidth: TREE_VIEW_MAX_WIDTH,
        }}
        selectedId={selectedId}
        initialExpendedItems={buildExpandedItems(TREE_MODAL_SHARED_ITEMS_ID)}
        items={sharedItems}
        onTreeItemSelect={onTreeItemSelect}
        useChildren={useChildren}
        useItem={useItem}
        showCheckbox
        rootLabel={translateBuilder(BUILDER.NAVIGATION_SHARED_ITEMS_TITLE)}
        rootId={TREE_MODAL_SHARED_ITEMS_ID}
        showItemFilter={isFolder}
        shouldFetchChildrenForItem={isFolder}
        isTreeItemDisabled={isTreeItemDisabled}
        // todo: change graasp-ui
        buildTreeItemClass={buildTreeItemId as any}
      />
    </>
  );

  return (
    <Dialog
      onClose={handleClose}
      aria-labelledby={dialogId}
      open={open}
      scroll="paper"
    >
      <DialogTitle id={dialogId}>{title}</DialogTitle>
      <DialogContent>{tree}</DialogContent>
      <DialogActions>
        <CancelButton onClick={handleClose} />
        <Button
          onClick={onClickConfirm}
          disabled={!selectedId}
          id={TREE_MODAL_CONFIRM_BUTTON_ID}
        >
          {translateBuilder(BUILDER.TREE_MODAL_CONFIRM_BUTTON)}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TreeModal;
