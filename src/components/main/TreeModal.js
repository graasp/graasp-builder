import React, { useState } from 'react';
import PropTypes, { arrayOf } from 'prop-types';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import { useTranslation } from 'react-i18next';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import { Button, makeStyles } from '@material-ui/core';
import { DynamicTreeView, Loader } from '@graasp/ui';
import { ROOT_ID, TREE_VIEW_MAX_WIDTH } from '../../config/constants';
import { ITEM_KEYS, ITEM_TYPES, TREE_PREVENT_SELECTION } from '../../enums';
import { hooks } from '../../config/queryClient';
import {
  buildTreeItemClass,
  TREE_MODAL_TREE_ID,
  TREE_MODAL_CONFIRM_BUTTON_ID,
} from '../../config/selectors';
import { getParentsIdsFromPath } from '../../utils/item';

const useStyles = makeStyles(() => ({
  root: {
    flexGrow: 1,
    maxWidth: TREE_VIEW_MAX_WIDTH,
  },
}));

const { useItem, useOwnItems, useChildren } = hooks;

const TreeModal = ({ itemIds, open, title, onClose, onConfirm, prevent }) => {
  const { t } = useTranslation();
  const classes = useStyles();
  const { data: items, isLoading } = useOwnItems();
  const [selectedId, setSelectedId] = useState(null);
  const { data: item, isItemLoading } = useItem(itemIds);

  const buildExpandedItems = () => {
    if (item) {
      const parentIds = getParentsIdsFromPath(item.get('path')) || [];
      const newExpandedItems = [ROOT_ID, ...parentIds];
      return newExpandedItems;
    }
    return [ROOT_ID];
  };

  if (isLoading || isItemLoading) {
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
    onConfirm({ id: itemIds, to: selectedId });
    handleClose();
  };

  const onTreeItemSelect = (nodeId) => {
    if (selectedId === nodeId) {
      setSelectedId(null);
    } else {
      setSelectedId(nodeId);
    }
  };

  const isFolder = (i) => i.get(ITEM_KEYS.TYPE) === ITEM_TYPES.FOLDER;

  // compute tree only when the modal is open
  const tree = !open ? null : (
    <DynamicTreeView
      id={TREE_MODAL_TREE_ID}
      className={classes.root}
      selectedId={selectedId}
      initialExpendedItems={buildExpandedItems()}
      items={items}
      onTreeItemSelect={onTreeItemSelect}
      useChildren={useChildren}
      useItem={useItem}
      showCheckbox
      rootLabel={t('Owned Items')}
      rootId={ROOT_ID}
      rootClassName={buildTreeItemClass(ROOT_ID)}
      showItemFilter={isFolder}
      shouldFetchChildrenForItem={isFolder}
      isTreeItemDisabled={isTreeItemDisabled}
      buildTreeItemClass={buildTreeItemClass}
    />
  );

  return (
    <Dialog
      onClose={handleClose}
      aria-labelledby="simple-dialog-title"
      open={open}
      scroll="paper"
    >
      <DialogTitle id="simple-dialog-title">{title}</DialogTitle>
      <DialogContent>{tree}</DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          {t('Cancel')}
        </Button>
        <Button
          onClick={onClickConfirm}
          color="primary"
          variant="contained"
          disabled={!selectedId}
          id={TREE_MODAL_CONFIRM_BUTTON_ID}
        >
          {t('Confirm')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

TreeModal.propTypes = {
  onConfirm: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  prevent: PropTypes.oneOf(Object.values(TREE_PREVENT_SELECTION)),
  itemIds: arrayOf(PropTypes.string),
  open: PropTypes.bool,
};

TreeModal.defaultProps = {
  prevent: TREE_PREVENT_SELECTION.NONE,
  itemIds: null,
  open: false,
};

export default TreeModal;
