import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import ItemsHeader from './ItemsHeader';
import NewItemButton from './NewItemButton';
import { setItem, getOwnItems } from '../../actions/item';
import ItemsGrid from './ItemsGrid';

class Home extends Component {
  static propTypes = {
    rootItems: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
    dispatchGetOwnItems: PropTypes.func.isRequired,
    match: PropTypes.shape({
      params: PropTypes.shape({ itemId: PropTypes.string }).isRequired,
    }).isRequired,
  };

  componentDidMount() {
    const {
      match: {
        params: { itemId },
      },
      dispatchGetOwnItems,
    } = this.props;
    return dispatchGetOwnItems(itemId);
  }

  componentDidUpdate() {
    const {
      match: {
        params: { itemId },
      },
      dispatchGetOwnItems,
      rootItems,
    } = this.props;
    if (rootItems.some(({ dirty }) => dirty)) {
      dispatchGetOwnItems(itemId);
    }
  }

  render() {
    const { rootItems } = this.props;
    return (
      <>
        <ItemsHeader />
        <NewItemButton />
        <ItemsGrid items={rootItems} />
      </>
    );
  }
}

const mapStateToProps = ({ item }) => ({
  rootItems: item.get('root').toJS(),
});

const mapDispatchToProps = {
  dispatchGetOwnItems: getOwnItems,
  dispatchSetItem: setItem,
};

const ConnectedComponent = connect(mapStateToProps, mapDispatchToProps)(Home);

export default withRouter(ConnectedComponent);
