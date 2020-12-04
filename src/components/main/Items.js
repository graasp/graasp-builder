import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import ItemsHeader from './ItemsHeader';
import CreateNewItemButton from './CreateNewItemButton';
import Item from './Item';
import { ItemContext } from '../context/item';

class Items extends Component {
  static contextType = ItemContext;

  static propTypes = {
    match: PropTypes.shape({
      params: PropTypes.shape({
        itemId: PropTypes.string,
      }).isRequired,
    }),
  };

  static defaultProps = {
    match: { params: { itemId: '' } },
  };

  state = { items: [] };

  async componentDidMount() {
    this.updateItems();
  }

  async componentDidUpdate({
    match: {
      params: { itemId: prevItemId },
    },
  }) {
    const {
      match: {
        params: { itemId },
      },
    } = this.props;

    if (prevItemId !== itemId) {
      this.updateItems();
    }
  }

  updateItems = async () => {
    const {
      match: {
        params: { itemId },
      },
    } = this.props;

    const { getChildren } = this.context;
    return this.setState({
      items: await getChildren(itemId),
    });
  };

  renderItems = () => {
    const { items } = this.state;

    if (!items.length) {
      return (
        <Typography variant="h3" align="center" display="block">
          No Item Here
        </Typography>
      );
    }

    return items.reverse().map((item) => (
      <Grid key={item.id} item xs={12} sm={6} md={4} lg={3} xl={2}>
        <Item item={item} />
      </Grid>
    ));
  };

  render() {
    return (
      <div>
        <ItemsHeader />
        <CreateNewItemButton />
        <Grid container spacing={1}>
          {this.renderItems()}
        </Grid>
      </div>
    );
  }
}

export default withRouter(Items);
