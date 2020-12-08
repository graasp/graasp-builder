import React, { Component } from 'react';
import { List } from 'immutable';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import CircularProgress from '@material-ui/core/CircularProgress';
import { Link } from 'react-router-dom';
import { HOME_PATH, buildItemPath } from '../../config/paths';
import { clearItem, getItem } from '../../actions/item';

// eslint-disable-next-line react/prefer-stateless-function
class Navigation extends Component {
  static propTypes = {
    history: PropTypes.shape({
      push: PropTypes.func.isRequired,
    }).isRequired,
    parents: PropTypes.instanceOf(List).isRequired,
    items: PropTypes.instanceOf(List).isRequired,
    dispatchClearItem: PropTypes.func.isRequired,
    dispatchGetItem: PropTypes.func.isRequired,
  };

  clearItem = () => {
    const { dispatchClearItem } = this.props;
    dispatchClearItem();
  };

  render() {
    const { parents, dispatchGetItem, items } = this.props;

    // todo: avoid rendering by using state
    const navEls = parents?.map((id) => {
      const el = items.find(({ id: thisId }) => thisId === id);
      if (!el) {
        dispatchGetItem(id);
      }
      return el;
    });

    if (!navEls?.every(Boolean)) {
      return <CircularProgress color="primary" />;
    }

    return (
      <Breadcrumbs aria-label="breadcrumb">
        <Link color="inherit" href="/" to={HOME_PATH} onClick={this.clearItem}>
          Owned Items
        </Link>
        {navEls.map(({ name, id }) => (
          <Link key={id} to={buildItemPath(id)}>
            <Typography>{name}</Typography>
          </Link>
        ))}
      </Breadcrumbs>
    );
  }
}

const mapStateToProps = ({ item }) => ({
  parents: item.getIn(['item', 'parents']),
  items: item.get('items'),
});

const mapDispatchToProps = {
  dispatchClearItem: clearItem,
  dispatchGetItem: getItem,
};

const ConnectedComponent = connect(
  mapStateToProps,
  mapDispatchToProps,
)(Navigation);

export default withRouter(ConnectedComponent);
