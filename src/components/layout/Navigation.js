import React, { Component } from 'react';
import { List } from 'immutable';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import { Link } from 'react-router-dom';
import { HOME_PATH, buildItemPath } from '../../config/paths';

// eslint-disable-next-line react/prefer-stateless-function
class Navigation extends Component {
  static propTypes = {
    history: PropTypes.shape({
      push: PropTypes.func.isRequired,
    }).isRequired,
    navigation: PropTypes.instanceOf(List).isRequired,
  };

  render() {
    const { navigation } = this.props;
    return (
      <Breadcrumbs aria-label="breadcrumb">
        <Link color="inherit" href="/" to={HOME_PATH}>
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

const ConnectedComponent = connect(mapStateToProps)(Navigation);

export default withRouter(ConnectedComponent);
