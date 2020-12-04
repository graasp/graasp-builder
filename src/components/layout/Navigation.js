import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import Link from '@material-ui/core/Link';
import { HOME_PATH } from '../../config/paths';
import { ItemContext } from '../context/item';

function handleClick(event) {
  event.preventDefault();
}

class Navigation extends Component {
  static contextType = ItemContext;

  static propTypes = {
    history: PropTypes.shape({
      push: PropTypes.func.isRequired,
    }).isRequired,
    match: PropTypes.shape({
      params: PropTypes.shape({
        itemId: PropTypes.string.isRequired,
      }).isRequired,
    }).isRequired,
  };

  state = {
    navigation: [],
  };

  async componentDidMount() {
    this.updateNavigation();
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
      this.updateNavigation();
    }
  }

  updateNavigation = async () => {
    const { getNavigation } = this.context;
    const {
      match: {
        params: { itemId },
      },
    } = this.props;

    this.setState({ navigation: await getNavigation(itemId) });
  };

  goHome = (event) => {
    const {
      history: { push },
    } = this.props;
    event.preventDefault();
    push(HOME_PATH);
  };

  render() {
    const { navigation } = this.state;
    return (
      <Breadcrumbs aria-label="breadcrumb">
        <Link color="inherit" href="/" onClick={this.goHome}>
          Owned Items
        </Link>
        {navigation.map(({ name, id }) => (
          <Link
            key={id}
            color="inherit"
            href="/getting-started/installation/"
            onClick={handleClick}
          >
            {name}
          </Link>
        ))}
      </Breadcrumbs>
    );
  }
}

export default withRouter(Navigation);
