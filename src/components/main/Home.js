import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import ItemsHeader from './ItemsHeader';
import CreateNewItemButton from './CreateNewItemButton';
import { setItem, getOwnItems } from '../../actions/item';
import ItemsGrid from './ItemsGrid';

class Home extends Component {
  static propTypes = {
    items: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
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

  render() {
    const { items } = this.props;
    return (
      <div>
        <ItemsHeader />
        <CreateNewItemButton />
        <ItemsGrid items={items} />
      </div>
    );
  }
}

const mapStateToProps = ({ item }) => ({
  items: item.getIn(['root']).toJS(),
});

const mapDispatchToProps = {
  dispatchGetOwnItems: getOwnItems,
  dispatchSetItem: setItem,
};

const ConnectedComponent = connect(mapStateToProps, mapDispatchToProps)(Home);

export default withRouter(ConnectedComponent);
