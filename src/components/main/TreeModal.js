import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Map } from 'immutable';
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
import { withCache } from './withCache';
import {
  getChildren,
  getItem,
  getOwnItems,
  moveItem,
} from '../../actions/item';
import { setMoveModalSettings } from '../../actions/layout';
import {
  ROOT_ID,
  TREE_PREVENT_SELECTION,
  TREE_VIEW_HEIGHT,
  TREE_VIEW_MAX_WIDTH,
} from '../../config/constants';
// import { getParentsIdsFromPath } from '../../utils/item';
import {
  buildTreeItemClass,
  TREE_MODAL_TREE_ID,
  TREE_MODAL_CONFIRM_BUTTON_ID,
} from '../../config/selectors';

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
    rootItems: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
    onConfirm: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired,
    title: PropTypes.string.isRequired,
    prevent: PropTypes.oneOf(Object.values(TREE_PREVENT_SELECTION)),
    dispatchGetChildren: PropTypes.func.isRequired,
    dispatchGetItem: PropTypes.func.isRequired,
    t: PropTypes.func.isRequired,
    pathIds: PropTypes.arrayOf(PropTypes.string),
    getItemSync: PropTypes.func.isRequired,
    getChildrenSync: PropTypes.func.isRequired,
  };

  static defaultProps = {
    prevent: TREE_PREVENT_SELECTION.NONE,
    pathIds: [],
  };

  state = { selectedId: null };

  shouldComponentUpdate({ settings }) {
    // update only when opened or on close
    const { settings: prevSettings } = this.props;
    const prevItemId = prevSettings.get('itemId');
    const open = settings.get('open');
    return open || (!open && Boolean(prevItemId));
  }

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
    const { dispatchGetChildren } = this.props;
    if (value !== ROOT_ID) {
      dispatchGetChildren(value);
    }
    this.setState({ selectedId: value });
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
  // bug: fetch all items until current item
  renderItemTreeItem = ({ children: tree, disabled }) => {
    const {
      classes,
      dispatchGetItem,
      dispatchGetChildren,
      getItemSync,
      getChildrenSync,
    } = this.props;
    // nothing to display
    if (!tree) {
      return null;
    }

    return tree.map(({ id }) => {
      const item = getItemSync(id);
      if (!item) {
        // dispatch item if does not exist in cache
        dispatchGetItem(id);
        dispatchGetChildren(id);
        return null;
      }
      const children = getChildrenSync(id);
      const { name } = item;
      const isDisabled = this.isTreeItemDisabled({ previous: disabled, id });

      const nodeId = isDisabled ? null : id;
      const className = clsx(buildTreeItemClass(id), {
        [classes.disabled]: isDisabled,
      });

      // recursive display of children
      if (children?.length) {
        return (
          <TreeItem key={id} nodeId={nodeId} label={name} className={className}>
            {!isDisabled &&
              children.length &&
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
    const { selectedId } = this.state;
    const { title, classes, settings, rootItems, t, pathIds } = this.props;
    return (
      <Dialog
        onClose={this.handleClose}
        aria-labelledby="simple-dialog-title"
        open={settings.get('open')}
      >
        <DialogTitle id="simple-dialog-title">{title}</DialogTitle>
        <TreeView
          id={TREE_MODAL_TREE_ID}
          className={classes.root}
          defaultCollapseIcon={<ExpandMoreIcon />}
          defaultExpandIcon={<ChevronRightIcon />}
          onNodeSelect={this.onSelect}
          defaultExpanded={[ROOT_ID, ...pathIds]}
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

const mapDispatchToProps = {
  dispatchGetItem: getItem,
  dispatchMoveItem: moveItem,
  dispatchGetOwnItems: getOwnItems,
  dispatchSetMoveModalSettings: setMoveModalSettings,
  dispatchGetChildren: getChildren,
};

const ConnectedComponent = connect(null, mapDispatchToProps)(TreeModal);

const TranslatedComponent = withTranslation()(ConnectedComponent);
const CacheComponent = withCache(TranslatedComponent);
export default withStyles(styles, { withTheme: true })(CacheComponent);
