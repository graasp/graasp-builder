import React, { Component } from 'react';
import List from 'immutable';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import ItemsHeader from './ItemsHeader';
import CreateNewItemButton from './CreateNewItemButton';
import Item from './Item';
import { getItem, getOwnItems } from '../../actions/item';

class Items extends Component {
  static propTypes = {
    children: PropTypes.instanceOf(List).isRequired,
    ownItems: PropTypes.instanceOf(List).isRequired,
    dispatchGetOwnItems: PropTypes.func.isRequired,
    dispatchGetItem: PropTypes.func.isRequired,
    match: PropTypes.shape({
      params: PropTypes.shape({ itemId: PropTypes.string }).isRequired,
    }).isRequired,
  };

  componentDidMount() {
    this.updateItem();
  }

  componentDidUpdate({
    match: {
      params: { itemId: prevId },
    },
  }) {
    const {
      match: {
        params: { itemId },
      },
    } = this.props;

    if (itemId !== prevId) {
      this.updateItem();
    }
  }

  updateItem = () => {
    const {
      match: {
        params: { itemId },
      },
      dispatchGetOwnItems,
      dispatchGetItem,
    } = this.props;

    if (itemId) {
      return dispatchGetItem(itemId);
    }

    return dispatchGetOwnItems(itemId);
  };

  renderItems = (items) => {
    if (!items.size) {
      return (
        <Typography variant="h3" align="center" display="block">
          No Item Here
        </Typography>
      );
    }

    return items.reverse().map((item) => (
      <Grid key={item.id} item xs={12} sm={6} md={4} lg={3} xl={2}>
        <Item item={item} />
      </Grid>
    ));
  };

  render() {
    const {
      children,
      ownItems,
      match: {
        params: { itemId },
      },
    } = this.props;
    return (
      <div>
        <ItemsHeader />
        <CreateNewItemButton />
        <Grid container spacing={1}>
          {itemId && this.renderItems(children)}
          {!itemId && this.renderItems(ownItems)}
        </Grid>
      </div>
    );
  }
}

const mapStateToProps = ({ item }) => ({
  children: item.getIn(['children']) || List(),
  ownItems: item.getIn(['own']) || List(),
});

const mapDispatchToProps = {
  dispatchGetOwnItems: getOwnItems,
  dispatchGetItem: getItem,
};

const ConnectedComponent = connect(mapStateToProps, mapDispatchToProps)(Items);

export default withRouter(ConnectedComponent);
