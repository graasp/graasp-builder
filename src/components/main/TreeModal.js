import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Map, List } from 'immutable';
import { withTranslation } from 'react-i18next';
import clsx from 'clsx';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import TreeView from '@material-ui/lab/TreeView';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import TreeItem from '@material-ui/lab/TreeItem';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import { Button } from '@material-ui/core';
import {
  getChildren,
  getItem,
  getOwnItems,
  getItems,
} from '../../actions/item';
import {
  ROOT_ID,
  TREE_PREVENT_SELECTION,
  TREE_VIEW_HEIGHT,
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
    height: TREE_VIEW_HEIGHT,
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
    settings: PropTypes.instanceOf(Map).isRequired,
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
    dispatchGetOwnItems: PropTypes.func.isRequired,
  };

  static defaultProps = {
    prevent: TREE_PREVENT_SELECTION.NONE,
  };

  state = { selectedId: null, expandedItems: [ROOT_ID] };

  componentDidMount() {
    const { dispatchGetOwnItems } = this.props;
    dispatchGetOwnItems();

    this.updateExpandedElements();
  }

  componentDidUpdate({ settings: prevSettings, items: prevItems }) {
    const { dispatchGetItems, settings, items } = this.props;
    const prevOpen = prevSettings.get('open');
    // expand tree until current item
    const itemId = settings.get('itemId');
    const open = settings.get('open');
    const item = getItemById(items, itemId);
    const prevItem = prevItems.find(({ id }) => id === itemId);
    if (!areItemsEqual(item, prevItem) || (!prevOpen && open)) {
      this.updateExpandedElements();
    }

    if (settings.get('open') && !prevSettings.get('open')) {
      dispatchGetItems();
    }
  }

  updateExpandedElements = () => {
    const { settings, items } = this.props;
    const { expandedItems } = this.state;
    const itemId = settings.get('itemId');
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
    const { settings, onConfirm } = this.props;
    const { selectedId } = this.state;
    onConfirm({ id: settings.get('itemId'), to: selectedId });
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
    const { settings, prevent } = this.props;

    switch (prevent) {
      case TREE_PREVENT_SELECTION.SELF_AND_CHILDREN:
        return previous || settings.get('itemId') === id;
      case TREE_PREVENT_SELECTION.NONE:
      default:
        return false;
    }
  };

  // recursively render tree until children are undefined
  renderItemTreeItem = ({ children: tree, disabled }) => {
    const { classes, dispatchGetItem, dispatchGetChildren, items } = this.props;
    // nothing to display
    if (!tree) {
      return null;
    }

    return tree.map(({ id }) => {
      const item = getItemById(items, id);
      if (!item || item.dirty) {
        // dispatch item if does not exist in cache
        dispatchGetItem(id);
        dispatchGetChildren(id);
        return null;
      }
      const children = getChildrenSync(items, id);
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
    const { title, classes, settings, rootItems, t } = this.props;

    // compute tree only when the modal is open
    const tree = !settings.get('open') ? null : (
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
        open={settings.get('open')}
      >
        <DialogTitle id="simple-dialog-title">{title}</DialogTitle>
        {tree}
        <Button
          onClick={this.onConfirm}
          color="primary"
          variant="contained"
          disabled={!selectedId}
          id={TREE_MODAL_CONFIRM_BUTTON_ID}
        >
          {t('Confirm')}
        </Button>
      </Dialog>
    );
  }
}

const mapStateToProps = ({ item }) => ({
  items: item.get('items'),
  rootItems: item.get('rootItems'),
});

const mapDispatchToProps = {
  dispatchGetItems: getItems,
  dispatchGetItem: getItem,
  dispatchGetOwnItems: getOwnItems,
  dispatchGetChildren: getChildren,
};

const ConnectedComponent = connect(
  mapStateToProps,
  mapDispatchToProps,
)(TreeModal);

const TranslatedComponent = withTranslation()(ConnectedComponent);
export default withStyles(styles, { withTheme: true })(TranslatedComponent);
