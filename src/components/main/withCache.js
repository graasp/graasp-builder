import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import cache, * as CacheOperations from '../../config/cache';
import { transformIdForPath } from '../../utils/item';

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
      callback: null,
    };

    componentDidMount() {
      const { updateItems } = this;
      updateItems();

      function callback() {
        this.onsuccess = updateItems;
      }

      // todo: this actually refresh a bit too often -> subscribe to the reducer changes?
      cache.items.hook('creating', callback);
      cache.items.hook('updating', callback);
      cache.items.hook('deleting', callback);

      this.setState({ callback });
    }

    componentWillUnmount() {
      const { callback } = this.state;
      cache.items.hook('creating').unsubscribe(callback);
      cache.items.hook('updating').unsubscribe(callback);
      cache.items.hook('deleting').unsubscribe(callback);
    }

    updateItems = async () => {
      const { itemId } = this.props;
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

    // sync function used in TreeModal
    getItemSync = (id) => {
      const { items } = this.state;
      return items.find(({ id: thisId }) => thisId === id);
    };

    getChildrenSync = (id) => {
      const { items } = this.state;
      const reg = new RegExp(`${transformIdForPath(id)}(?=\\.[^\\.]*$)`);
      return items.filter(({ path }) => path.match(reg));
    };

    render() {
      const { items, rootItems, item } = this.state;
      return (
        <WrappedComponent
          items={items}
          rootItems={rootItems}
          item={item}
          getChildrenSync={this.getChildrenSync}
          getItemSync={this.getItemSync}
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
