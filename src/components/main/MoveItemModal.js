import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { List } from 'immutable';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import TreeView from '@material-ui/lab/TreeView';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import TreeItem from '@material-ui/lab/TreeItem';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import { Button } from '@material-ui/core';

const styles = () => ({
  root: {
    height: 240,
    flexGrow: 1,
    maxWidth: 400,
  },
});

class MoveItemModal extends Component {
  static propTypes = {
    onClose: PropTypes.func.isRequired,
    open: PropTypes.bool.isRequired,
    classes: PropTypes.shape({
      root: PropTypes.string.isRequired,
    }).isRequired,
    items: PropTypes.instanceOf(List).isRequired,
  };

  handleClose = () => {
    const { onClose } = this.props;
    onClose();
  };

  onConfirm = () => {
    const { onClose } = this.props;
    // eslint-disable-next-line no-console
    onClose();
  };

  onSelect = (e, value) => {
    // eslint-disable-next-line no-console
    console.log(value);
  };

  renderItemTreeItem = (items) => {
    return items?.map(({ id, name, children }) => (
      <TreeItem key={id} nodeId={id} label={name}>
        {this.renderItemTreeItem(children)}
      </TreeItem>
    ));
  };

  render() {
    const { items } = this.props;
    const { open, classes } = this.props;
    return (
      <Dialog
        onClose={this.handleClose}
        aria-labelledby="simple-dialog-title"
        open={open}
      >
        <DialogTitle id="simple-dialog-title">
          Where do you want to move the item?
        </DialogTitle>
        <TreeView
          className={classes.root}
          defaultCollapseIcon={<ExpandMoreIcon />}
          defaultExpandIcon={<ChevronRightIcon />}
          onNodeSelect={this.onSelect}
        >
          {this.renderItemTreeItem(items)}
        </TreeView>
        <Button onClick={this.onConfirm} color="primary" variant="contained">
          Confirm
        </Button>
      </Dialog>
    );
  }
}

const mapStateToProps = ({ item }) => ({
  items: item.getIn(['items']),
});

const mapDispatchToProps = {};

const ConnectedComponent = connect(
  mapStateToProps,
  mapDispatchToProps,
)(MoveItemModal);

export default withStyles(styles)(ConnectedComponent);
