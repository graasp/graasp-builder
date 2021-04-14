import React, { Component } from 'react';
import { Map } from 'immutable';
import { withRouter } from 'react-router';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import { Link } from 'react-router-dom';
import { HOME_PATH, buildItemPath } from '../../config/paths';
import { clearItem } from '../../actions';
import {
  buildNavigationLink,
  NAVIGATION_HOME_LINK_ID,
} from '../../config/selectors';

class Navigation extends Component {
  static propTypes = {
    history: PropTypes.shape({
      push: PropTypes.func.isRequired,
    }).isRequired,
    item: PropTypes.instanceOf(Map).isRequired,
    dispatchClearItem: PropTypes.func.isRequired,
    t: PropTypes.func.isRequired,
    rootText: PropTypes.string,
  };

  static defaultProps = {
    rootText: null,
  };

  clearItem = () => {
    const { dispatchClearItem } = this.props;
    dispatchClearItem();
  };

  render() {
    const { item, t, rootText } = this.props;
    const parents = item?.get('parents');

    return (
      <Breadcrumbs aria-label="breadcrumb">
        <Link color="inherit" href="/" to={HOME_PATH} onClick={this.clearItem}>
          <Typography id={NAVIGATION_HOME_LINK_ID}>
            {rootText || t('My Items')}
          </Typography>
        </Link>
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
