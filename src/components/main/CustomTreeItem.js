import React from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core';
import PropTypes from 'prop-types';
import TreeItem from '@material-ui/lab/TreeItem';
import {
  ITEM_TYPES,
  LOADING_CONTENT,
  TREE_PREVENT_SELECTION,
} from '../../config/constants';
import { buildTreeItemClass } from '../../config/selectors';
import { useChildren, useItem } from '../../hooks';

const useStyles = makeStyles((theme) => ({
  disabled: {
    opacity: 0.5,
    color: theme.palette.primary.main,
  },
}));

// compute whether the given id tree item is disabled
// it depends on the prevent mode and the previous items
const isTreeItemDisabled = ({
  targetId,
  previousIsDisabled,
  itemId,
  prevent,
}) => {
  switch (prevent) {
    case TREE_PREVENT_SELECTION.SELF_AND_CHILDREN:
      // if the previous item is disabled, its children will be disabled
      // and prevent selection on self
      return previousIsDisabled || itemId === targetId;
    case TREE_PREVENT_SELECTION.NONE:
    default:
      return false;
  }
};

const CustomTreeItem = ({
  id,
  disabled,
  prevent,
  expandedItems,
  selectedId,
  targetId,
}) => {
  const classes = useStyles();
  const { data: item, isLoading } = useItem(id);
  const isFolder = item?.get('type') === ITEM_TYPES.FOLDER;
  const isExpanded = expandedItems.includes(id);
  const isDisabled = isTreeItemDisabled({
    previousIsDisabled: disabled,
    itemId: id,
    prevent,
    targetId,
  });
  const { data: children, isLoading: childrenIsLoading } = useChildren(id, {
    enabled: isFolder && isExpanded && !isDisabled,
  });
  const showChildren = isExpanded && !isDisabled && children?.size;

  if (isLoading) {
    return <TreeItem key={id} label={LOADING_CONTENT} />;
  }

  // display only folders
  if (!isFolder) {
    return null;
  }

  const name = item.get('name');

  const nodeId = isDisabled ? null : id;
  const className = clsx(buildTreeItemClass(id), {
    [classes.disabled]: isDisabled,
  });

  const renderChildrenItems = () => {
    const folderChildren = children.filter(
      ({ type }) => type === ITEM_TYPES.FOLDER,
    );

    if (!folderChildren.size) {
      return null;
    }

    if (childrenIsLoading) {
      return LOADING_CONTENT;
    }

    return folderChildren.map(({ id: childId }) => (
      <CustomTreeItem
        id={childId}
        disabled={isDisabled}
        prevent={prevent}
        expandedItems={expandedItems}
        selectedId={selectedId}
        targetId={targetId}
      />
    ));
  };

  // render children
  const childrenTreeItems = showChildren ? renderChildrenItems() : null;

  // recursive display of children
  return (
    <TreeItem key={id} nodeId={nodeId} label={name} className={className}>
      {childrenTreeItems}
    </TreeItem>
  );
};

CustomTreeItem.propTypes = {
  id: PropTypes.string.isRequired,
  disabled: PropTypes.bool,
  prevent: PropTypes.oneOf(Object.values(TREE_PREVENT_SELECTION)),
  expandedItems: PropTypes.arrayOf(PropTypes.string),
  selectedId: PropTypes.string,
  targetId: PropTypes.string.isRequired,
};

CustomTreeItem.defaultProps = {
  disabled: false,
  prevent: TREE_PREVENT_SELECTION.NONE,
  expandedItems: [],
  selectedId: null,
};

export default CustomTreeItem;
