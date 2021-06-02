import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import TreeView from '@material-ui/lab/TreeView';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import TreeItem from '@material-ui/lab/TreeItem';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import { useTranslation } from 'react-i18next';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import { Button, makeStyles } from '@material-ui/core';
import { useItem, useOwnItems } from '../../hooks';
import { ROOT_ID, TREE_VIEW_MAX_WIDTH } from '../../config/constants';
import { TREE_PREVENT_SELECTION } from '../../config/enum';
import {
  buildTreeItemClass,
  TREE_MODAL_TREE_ID,
  TREE_MODAL_CONFIRM_BUTTON_ID,
} from '../../config/selectors';
import { getParentsIdsFromPath } from '../../utils/item';
import CustomTreeItem from './CustomTreeItem';
import Loader from '../common/Loader';

const useStyles = makeStyles(() => ({
  root: {
    flexGrow: 1,
    maxWidth: TREE_VIEW_MAX_WIDTH,
  },
}));

const TreeModal = ({ itemId, open, title, onClose, onConfirm, prevent }) => {
  const { t } = useTranslation();
  const classes = useStyles();
  const [expandedItems, setExpandedItems] = useState([ROOT_ID]);
  const [selectedId, setSelectedId] = useState(null);
  const { data: items, isLoading } = useOwnItems();
  const { data: item } = useItem(itemId);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const initExpandedElements = () => {
    if (item) {
      const parentIds = getParentsIdsFromPath(item.get('path')) || [];
      const newExpandedItems = [...expandedItems, ...parentIds];
      setExpandedItems(newExpandedItems);
    }
  };

  // init expanded items depending on item id and if the modal is open
  useEffect(() => {
    if (open && itemId) {
      initExpandedElements();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, itemId]);

  if (isLoading) {
    return <Loader />;
  }

  const handleClose = () => {
    onClose({ id: null, open: false });
  };

  const onClickConfirm = () => {
    onConfirm({ id: itemId, to: selectedId });
    handleClose();
  };

  const onSelect = (e, value) => {
    // toggle item expansion
    const isExpanded = expandedItems.includes(value);
    const newExpandedItems = isExpanded
      ? expandedItems.filter((id) => id !== value)
      : [...expandedItems, value];

    setSelectedId(value);
    setExpandedItems(newExpandedItems);
  };

  // compute tree only when the modal is open
  const tree = !open ? null : (
    <TreeView
      id={TREE_MODAL_TREE_ID}
      className={classes.root}
      defaultCollapseIcon={<ExpandMoreIcon />}
      defaultExpandIcon={<ChevronRightIcon />}
      onNodeSelect={onSelect}
      expanded={expandedItems}
    >
      <TreeItem
        nodeId={ROOT_ID}
        className={buildTreeItemClass(ROOT_ID)}
        label={t('Owned Items')}
      >
        {items.map(({ id }) => (
          <CustomTreeItem
            id={id}
            disabled={false}
            prevent={prevent}
            expandedItems={expandedItems}
            selectedId={selectedId}
            targetId={itemId}
          />
        ))}
      </TreeItem>
    </TreeView>
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
  itemId: PropTypes.string,
  open: PropTypes.bool,
};

TreeModal.defaultProps = {
  prevent: TREE_PREVENT_SELECTION.NONE,
  itemId: null,
  open: false,
};

export default TreeModal;
