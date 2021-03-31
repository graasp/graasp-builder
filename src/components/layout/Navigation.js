import React, { Component } from 'react';
import { Map } from 'immutable';
import { withRouter } from 'react-router';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import { Link } from 'react-router-dom';
import {
  HOME_PATH,
  buildItemPath,
  SHARED_ITEMS_PATH,
} from '../../config/paths';
import { clearItem } from '../../actions';
import {
  buildNavigationLink,
  NAVIGATION_HOME_LINK_ID,
} from '../../config/selectors';

class Navigation extends Component {
  static propTypes = {
    location: PropTypes.shape({
      pathname: PropTypes.func.isRequired,
    }).isRequired,
    item: PropTypes.instanceOf(Map).isRequired,
    dispatchClearItem: PropTypes.func.isRequired,
    t: PropTypes.func.isRequired,
    user: PropTypes.instanceOf(Map).isRequired,
  };

  clearItem = () => {
    const { dispatchClearItem } = this.props;
    dispatchClearItem();
  };

  renderRootLink = () => {
    const {
      t,
      item,
      user,
      location: { pathname },
    } = this.props;

    // build root depending on user permission or pathname
    // todo: consider accessing from guest
    const ownItem =
      pathname === HOME_PATH || item?.get('creator') === user.get('id');
    const to = ownItem ? HOME_PATH : SHARED_ITEMS_PATH;
    const text = ownItem ? t('My Items') : t('Shared Items');

    return (
      <Link color="inherit" to={to} onClick={this.clearItem}>
        <Typography id={NAVIGATION_HOME_LINK_ID}>{text}</Typography>
      </Link>
    );
  };

  render() {
    const { item } = this.props;
    const parents = item?.get('parents');

    return (
      <Breadcrumbs aria-label="breadcrumb">
        {this.renderRootLink()}
        {[...parents]?.map(({ name, id }) => (
          <Link key={id} to={buildItemPath(id)}>
            <Typography id={buildNavigationLink(id)}>{name}</Typography>
          </Link>
        ))}
        {item.get('id') && (
          <Link key={item.get('id')} to={buildItemPath(item.get('id'))}>
            <Typography id={buildNavigationLink(item.get('id'))}>
              {item.get('name')}
            </Typography>
          </Link>
        )}
      </Breadcrumbs>
    );
  }
}

const mapDispatchToProps = {
  dispatchClearItem: clearItem,
};

const ConnectedComponent = connect(null, mapDispatchToProps)(Navigation);

const TranslatedComponent = withTranslation()(ConnectedComponent);
export default withRouter(TranslatedComponent);
