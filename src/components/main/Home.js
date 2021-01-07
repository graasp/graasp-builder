import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import ItemsHeader from './ItemsHeader';
import NewItemButton from './NewItemButton';
import { getOwnItems } from '../../actions/item';
import ItemsGrid from './ItemsGrid';

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
    const { dispatchGetOwnItems, activity, rootItems } = this.props;

    if (!activity) {
      // update dirty items
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
  rootItems: item.get('rootItems'),
});

const mapDispatchToProps = {
  dispatchGetOwnItems: getOwnItems,
};

const ConnectedComponent = connect(mapStateToProps, mapDispatchToProps)(Home);
export default withRouter(ConnectedComponent);
