import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import ItemsHeader from './ItemsHeader';
import NewItemButton from './NewItemButton';
import { setItem, getOwnItems } from '../../actions/item';
import ItemsGrid from './ItemsGrid';
import * as CacheOperations from '../../config/cache';
import { withCache } from './withCache';

class Home extends Component {
  static propTypes = {
    dispatchGetOwnItems: PropTypes.func.isRequired,
    match: PropTypes.shape({
      params: PropTypes.shape({ itemId: PropTypes.string }).isRequired,
    }).isRequired,
    activity: PropTypes.bool.isRequired,
    rootItems: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  };

  async componentDidMount() {
    const { dispatchGetOwnItems } = this.props;
    dispatchGetOwnItems();
  }

  async componentDidUpdate() {
    const { dispatchGetOwnItems, activity } = this.props;
    const rootItems = await CacheOperations.getRootItems();

    if (!activity) {
      // in case of changes on own itmes, update them
      // case ??
      if (rootItems.some(({ dirty }) => dirty)) {
        dispatchGetOwnItems();
      }
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
  activity: Object.values(item.get('activity').toJS()).flat().length,
});

const mapDispatchToProps = {
  dispatchGetOwnItems: getOwnItems,
  dispatchSetItem: setItem,
};

const ConnectedComponent = connect(mapStateToProps, mapDispatchToProps)(Home);
const CacheComponent = withCache(ConnectedComponent);
export default withRouter(CacheComponent);
