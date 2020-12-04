import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import TreeView from '@material-ui/lab/TreeView';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import TreeItem from '@material-ui/lab/TreeItem';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import { Button } from '@material-ui/core';
import { ItemContext } from '../context/item';
import { getItemTree } from '../../api/item';

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
  };

  static contextType = ItemContext;

  state = {
    items: [],
  };

  async componentDidMount() {
    const { items } = this.context;
    const tree = await getItemTree(items);
    this.setState({ items: tree });
  }

  handleClose = () => {
    const { onClose } = this.props;
    onClose();
  };

  onConfirm = () => {
    const { onClose } = this.props;
    // eslint-disable-next-line no-console
    console.log('I choosed');
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
    const { items } = this.state;
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

export default withStyles(styles)(MoveItemModal);
