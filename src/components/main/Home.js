import React, { Component } from 'react';
import List from 'immutable';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import ItemsHeader from './ItemsHeader';
import CreateNewItemButton from './CreateNewItemButton';
import { setItem, getOwnItems } from '../../actions/item';
import ItemsGrid from './ItemsGrid';

class Items extends Component {
  static propTypes = {
    items: PropTypes.instanceOf(List).isRequired,
    ownItems: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
    dispatchGetOwnItems: PropTypes.func.isRequired,
    match: PropTypes.shape({
      params: PropTypes.shape({ itemId: PropTypes.string }).isRequired,
    }).isRequired,
  };

  componentDidMount() {
    this.updateItem();
  }

  componentDidUpdate({ items: prevItems }) {
    const { items } = this.props;
    if (items !== prevItems) {
      this.updateItem();
    }
  }

  updateItem = () => {
    const {
      match: {
        params: { itemId },
      },
      dispatchGetOwnItems,
    } = this.props;
    return dispatchGetOwnItems(itemId);
  };

  render() {
    const { ownItems } = this.props;
    return (
      <div>
        <ItemsHeader />
        <CreateNewItemButton />
        <ItemsGrid items={ownItems} />
      </div>
    );
  }
}

const mapStateToProps = ({ item }) => ({
  ownItems: item.getIn(['own']).toJS(),
  items: item.getIn(['items']),
});

const mapDispatchToProps = {
  dispatchGetOwnItems: getOwnItems,
  dispatchSetItem: setItem,
};

const ConnectedComponent = connect(mapStateToProps, mapDispatchToProps)(Items);

export default withRouter(ConnectedComponent);
