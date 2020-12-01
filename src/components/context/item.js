import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { getOwnItems, deleteItem } from '../../api/item';
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

  buildValue = () => {
    const { items } = this.state;
    return {
      items,
      addItem: this.addItem,
      deleteItem: this.deleteItem,
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
