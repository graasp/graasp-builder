import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { List } from 'immutable';
import { withTranslation } from 'react-i18next';
import clsx from 'clsx';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import TreeView from '@material-ui/lab/TreeView';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import TreeItem from '@material-ui/lab/TreeItem';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import { Button } from '@material-ui/core';
import { getChildren, getItem, getItems } from '../../actions';
import {
  ITEM_TYPES,
  ROOT_ID,
  TREE_PREVENT_SELECTION,
  TREE_VIEW_MAX_WIDTH,
} from '../../config/constants';
import {
  buildTreeItemClass,
  TREE_MODAL_TREE_ID,
  TREE_MODAL_CONFIRM_BUTTON_ID,
} from '../../config/selectors';
import {
  getItemById,
  getParentsIdsFromPath,
  getChildren as getChildrenSync,
  areItemsEqual,
} from '../../utils/item';

const styles = (theme) => ({
  root: {
    flexGrow: 1,
    maxWidth: TREE_VIEW_MAX_WIDTH,
  },
  disabled: {
    opacity: 0.8,
    color: theme.palette.primary.main,
  },
});

class TreeModal extends Component {
  static propTypes = {
    classes: PropTypes.shape({
      root: PropTypes.string.isRequired,
      disabled: PropTypes.string.isRequired,
    }).isRequired,
    onConfirm: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired,
    title: PropTypes.string.isRequired,
    prevent: PropTypes.oneOf(Object.values(TREE_PREVENT_SELECTION)),
    dispatchGetChildren: PropTypes.func.isRequired,
    dispatchGetItem: PropTypes.func.isRequired,
    t: PropTypes.func.isRequired,
    rootItems: PropTypes.instanceOf(List).isRequired,
    items: PropTypes.instanceOf(List).isRequired,
    dispatchGetItems: PropTypes.func.isRequired,
    itemId: PropTypes.string,
    open: PropTypes.bool,
  };

  static defaultProps = {
    prevent: TREE_PREVENT_SELECTION.NONE,
    itemId: null,
    open: false,
  };

  state = { selectedId: null, expandedItems: [ROOT_ID] };

  componentDidMount() {
    this.updateExpandedElements();
  }

  componentDidUpdate({ itemId: prevItemId, open: prevOpen, items: prevItems }) {
    const { dispatchGetItems, items, itemId, open } = this.props;
    // expand tree until current item
    const item = getItemById(items, itemId);
    const prevItem = prevItems.find(({ id }) => id === prevItemId);
    if (!areItemsEqual(item, prevItem) || (!prevOpen && open)) {
      this.updateExpandedElements();
    }

    if (open && !prevOpen) {
      dispatchGetItems();
    }
  }

  updateExpandedElements = () => {
    const { itemId, items } = this.props;
    const { expandedItems } = this.state;
    const item = getItemById(items, itemId);
    if (item) {
      const parentIds = getParentsIdsFromPath(item.path) || [];
      const newExpandedItems = [...expandedItems, ...parentIds];
      // eslint-disable-next-line react/no-did-update-set-state
      this.setState({ expandedItems: newExpandedItems });
    }
  };

  handleClose = () => {
    const { onClose } = this.props;
    onClose({ id: null, open: false });
  };

  onConfirm = () => {
    const { itemId, onConfirm } = this.props;
    const { selectedId } = this.state;
    onConfirm({ id: itemId, to: selectedId });
    this.handleClose();
  };

  onSelect = (e, value) => {
    const { expandedItems } = this.state;
    const { dispatchGetChildren } = this.props;
    if (value !== ROOT_ID) {
      dispatchGetChildren(value);
    }
    // control item expansion
    const isExpanded = expandedItems.includes(value);
    const newExpandedItems = isExpanded
      ? expandedItems.filter((id) => id !== value)
      : [...expandedItems, value];

    this.setState({ selectedId: value, expandedItems: newExpandedItems });
  };

  isTreeItemDisabled = ({ previous, id }) => {
    const { itemId, prevent } = this.props;

    switch (prevent) {
      case TREE_PREVENT_SELECTION.SELF_AND_CHILDREN:
        return previous || itemId === id;
      case TREE_PREVENT_SELECTION.NONE:
      default:
        return false;
    }
  };

  // recursively render tree until children are undefined
  renderItemTreeItem = ({ children: tree, disabled }) => {
    const { classes, dispatchGetItem, dispatchGetChildren, items } = this.props;

    // only display spaces
    const spaces = tree.filter(({ type }) => type === ITEM_TYPES.SPACE);

    // nothing to display
    if (!spaces) {
      return null;
    }

    return spaces.map(({ id }) => {
      const item = getItemById(items, id);
      if (!item || item.dirty) {
        // dispatch item if does not exist in cache
        dispatchGetItem(id);
        dispatchGetChildren(id);
        return null;
      }

      // only display spaces
      const children = getChildrenSync(items, id).filter(
        ({ type }) => type === ITEM_TYPES.SPACE,
      );
      const { name } = item;
      const isDisabled = this.isTreeItemDisabled({ previous: disabled, id });

      const nodeId = isDisabled ? null : id;
      const className = clsx(buildTreeItemClass(id), {
        [classes.disabled]: isDisabled,
      });

      // recursive display of children
      if (children?.size) {
        return (
          <TreeItem key={id} nodeId={nodeId} label={name} className={className}>
            {!isDisabled &&
              children.size &&
              this.renderItemTreeItem({
                children,
                disabled: isDisabled,
              })}
          </TreeItem>
        );
      }
      return (
        <TreeItem key={id} nodeId={nodeId} label={name} className={className} />
      );
    });
  };

  render() {
    const { selectedId, expandedItems } = this.state;
    const { title, classes, open, rootItems, t } = this.props;

    // compute tree only when the modal is open
    const tree = !open ? null : (
      <TreeView
        id={TREE_MODAL_TREE_ID}
        className={classes.root}
        defaultCollapseIcon={<ExpandMoreIcon />}
        defaultExpandIcon={<ChevronRightIcon />}
        onNodeSelect={this.onSelect}
        expanded={expandedItems}
      >
        <TreeItem
          nodeId={ROOT_ID}
          className={buildTreeItemClass(ROOT_ID)}
          label={t('Owned Items')}
        >
          {this.renderItemTreeItem({
            id: ROOT_ID,
            children: rootItems,
            disabled: false,
          })}
        </TreeItem>
      </TreeView>
    );

    return (
      <Dialog
        onClose={this.handleClose}
        aria-labelledby="simple-dialog-title"
        open={open}
        scroll="paper"
      >
        <DialogTitle id="simple-dialog-title">{title}</DialogTitle>
        <DialogContent>{tree}</DialogContent>
        <DialogActions>
          <Button
            onClick={this.onConfirm}
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
  }
}

const mapStateToProps = ({ item }) => ({
  items: item.get('items'),
  rootItems: item.get('own'),
});

const mapDispatchToProps = {
  dispatchGetItems: getItems,
  dispatchGetItem: getItem,
  dispatchGetChildren: getChildren,
};

const ConnectedComponent = connect(
  mapStateToProps,
  mapDispatchToProps,
)(TreeModal);

const TranslatedComponent = withTranslation()(ConnectedComponent);
export default withStyles(styles, { withTheme: true })(TranslatedComponent);
