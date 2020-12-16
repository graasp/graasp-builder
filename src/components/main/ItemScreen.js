import React, { Component } from 'react';
import List from 'immutable';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import CircularProgress from '@material-ui/core/CircularProgress';
import { withRouter } from 'react-router';
import ItemsHeader from './ItemsHeader';
import NewItemButton from './NewItemButton';
import { clearItem, setItem } from '../../actions/item';
import ItemsGrid from './ItemsGrid';

class ItemScreen extends Component {
  static propTypes = {
    children: PropTypes.arrayOf(PropTypes.string),
    items: PropTypes.instanceOf(List).isRequired,
    dispatchSetItem: PropTypes.func.isRequired,
    match: PropTypes.shape({
      params: PropTypes.shape({ itemId: PropTypes.string }).isRequired,
    }).isRequired,
    dispatchClearItem: PropTypes.func.isRequired,
  };

  static defaultProps = {
    children: [],
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

  componentWillUnmount() {
    const { dispatchClearItem } = this.props;
    dispatchClearItem();
  }

  updateItem = () => {
    const {
      match: {
        params: { itemId },
      },
      dispatchSetItem,
    } = this.props;

    return dispatchSetItem(itemId);
  };

  render() {
    const { children, items } = this.props;

    // get complete elements from id
    const completeItems = children.map((id) =>
      items.find(({ id: thisId }) => id === thisId),
    );

    // wait until all children are available
    if (!completeItems.every(Boolean)) {
      return <CircularProgress color="primary" />;
    }

    return (
      <>
        <ItemsHeader />
        <NewItemButton />
        <ItemsGrid items={completeItems} />
      </>
    );
  }
}

const mapStateToProps = ({ item }) => ({
  items: item.getIn(['items']),
  children: item.getIn(['item', 'children']),
});

const mapDispatchToProps = {
  dispatchSetItem: setItem,
  dispatchClearItem: clearItem,
};

const ConnectedComponent = connect(
  mapStateToProps,
  mapDispatchToProps,
)(ItemScreen);

export default withRouter(ConnectedComponent);
