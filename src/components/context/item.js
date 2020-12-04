import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { getOwnItems, deleteItem, getChildren, getItem } from '../../api/item';
import sampleItems from '../../data/sample';

const ItemContext = React.createContext();

class ItemProvider extends Component {
  static propTypes = {
    children: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.node),
      PropTypes.node,
    ]).isRequired,
  };

  state = {
    items: [],
  };

  async componentDidMount() {
    const ownedItems = (await getOwnItems()) || sampleItems;
    this.setState({ items: ownedItems });
  }

  addItem = (item) => {
    const { items } = this.state;
    this.setState({ items: [...items, item] });
  };

  setItems = (items) => {
    this.setState({ items });
  };

  deleteItem = async (id) => {
    const { items } = this.state;
    const deletedItem = await deleteItem(id);
    if (deletedItem.status === 404) {
      return console.error(`Couldn't delete item ${id}`);
    }
    return this.setState({
      items: items.filter(({ id: thisId }) => thisId !== id),
    });
  };

  getChildren = async (id) => {
    if (!id) {
      return getOwnItems();
    }
    return getChildren(id);
  };

  getNavigation = async (itemId) => {
    if (!itemId) {
      return [];
    }
    const navigation = [];
    let currentParentId = itemId;
    while (currentParentId) {
      // eslint-disable-next-line no-await-in-loop
      const parent = await getItem(currentParentId);
      navigation.push(parent);
      currentParentId = parent.parentId;
    }
    return navigation;
  };

  buildValue = () => {
    const { items } = this.state;
    return {
      items,
      addItem: this.addItem,
      deleteItem: this.deleteItem,
      getChildren: this.getChildren,
      getNavigation: this.getNavigation,
    };
  };

  render() {
    const { children } = this.props;
    return (
      <ItemContext.Provider value={this.buildValue()}>
        {children}
      </ItemContext.Provider>
    );
  }
}

export { ItemProvider, ItemContext };
