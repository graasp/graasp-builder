import React, { Component } from 'react';
import { List } from 'immutable';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import { Link } from 'react-router-dom';
import { HOME_PATH, buildItemPath } from '../../config/paths';
import { clearItem } from '../../actions/item';

// eslint-disable-next-line react/prefer-stateless-function
class Navigation extends Component {
  static propTypes = {
    history: PropTypes.shape({
      push: PropTypes.func.isRequired,
    }).isRequired,
    navigation: PropTypes.instanceOf(List).isRequired,
    dispatchClearItem: PropTypes.func.isRequired,
  };

  clearItem = () => {
    const { dispatchClearItem } = this.props;
    dispatchClearItem();
  };

  render() {
    const { navigation } = this.props;
    return (
      <Breadcrumbs aria-label="breadcrumb">
        <Link color="inherit" href="/" to={HOME_PATH} onClick={this.clearItem}>
          Owned Items
        </Link>
        {navigation.map(({ name, id }) => (
          <Link key={id} to={buildItemPath(id)}>
            <Typography>{name}</Typography>
          </Link>
        ))}
      </Breadcrumbs>
    );
  }
}

const mapStateToProps = ({ item }) => ({
  navigation: item.getIn(['parents']),
});

const mapDispatchToProps = {
  dispatchClearItem: clearItem,
};

const ConnectedComponent = connect(
  mapStateToProps,
  mapDispatchToProps,
)(Navigation);

export default withRouter(ConnectedComponent);
