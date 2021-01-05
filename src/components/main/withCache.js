import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import cache, * as CacheOperations from '../../config/cache';

function getDisplayName(WrappedComponent) {
  return WrappedComponent.displayName || WrappedComponent.name || 'Component';
}

// eslint-disable-next-line import/prefer-default-export
export const withCache = (WrappedComponent) => {
  class WithCache extends Component {
    static propTypes = {
      itemId: PropTypes.string,
    };

    static defaultProps = {
      itemId: null,
    };

    state = {
      items: [],
      rootItems: [],
      item: null,
    };

    componentDidMount() {
      this.updateItems();

      // todo: this actually refresh a bit too often -> subscribe to the reducer changes?
      cache.items.hook('creating', this.updateItems);
      cache.items.hook('updating', this.updateItems);
      cache.items.hook('deleting', this.updateItems);
    }

    componentWillUnmount() {
      cache.items.hook('creating').unsubscribe(this.updateItems);
      cache.items.hook('updating').unsubscribe(this.updateItems);
      cache.items.hook('deleting').unsubscribe(this.updateItems);
    }

    updateItems = async () => {
      const { itemId } = this.props;
      // eslint-disable-next-line no-console
      console.log('update in cache');
      const items = await CacheOperations.getItems();
      const rootItems = await CacheOperations.getRootItems();

      let item = null;
      if (itemId) {
        item = await CacheOperations.getItem(itemId);
        if (item) {
          item.children = await CacheOperations.getChildren(itemId);
          item.parents = await CacheOperations.getParents(itemId);
        }
      }
      this.setState({ items, rootItems, item });
    };

    render() {
      const { items, rootItems, item } = this.state;
      return (
        <WrappedComponent
          items={items}
          rootItems={rootItems}
          item={item}
          // eslint-disable-next-line react/jsx-props-no-spreading
          {...this.props}
        />
      );
    }
  }

  const mapStateToProps = ({ item }) => ({
    itemId: item.getIn(['item', 'id']),
  });

  // eslint-disable-next-line import/prefer-default-export
  const component = connect(mapStateToProps)(WithCache);
  component.displayName = `WithCache(${getDisplayName(WrappedComponent)})`;

  return component;
};
