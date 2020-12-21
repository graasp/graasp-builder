import React, { Component } from 'react';
import { List, Map } from 'immutable';
import { withRouter } from 'react-router';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import { Link } from 'react-router-dom';
import { HOME_PATH, buildItemPath } from '../../config/paths';
import { clearItem, getItem } from '../../actions/item';
import {
  buildNavigationLink,
  NAVIGATION_HOME_LINK_ID,
} from '../../config/selectors';

// eslint-disable-next-line react/prefer-stateless-function
class Navigation extends Component {
  static propTypes = {
    history: PropTypes.shape({
      push: PropTypes.func.isRequired,
    }).isRequired,
    item: PropTypes.instanceOf(Map).isRequired,
    items: PropTypes.instanceOf(List).isRequired,
    dispatchClearItem: PropTypes.func.isRequired,
    dispatchGetItem: PropTypes.func.isRequired,
    t: PropTypes.func.isRequired,
  };

  clearItem = () => {
    const { dispatchClearItem } = this.props;
    dispatchClearItem();
  };

  render() {
    const { item, dispatchGetItem, items, t } = this.props;
    const itemName = item.get('name');
    const itemId = item.get('id');

    // todo: avoid rendering by using state
    const navEls = item.get('parents')?.map((id) => {
      const el = items.find(({ id: thisId }) => thisId === id);
      if (!el) {
        dispatchGetItem(id);
      }
      return el;
    });

    return (
      <Breadcrumbs aria-label="breadcrumb">
        <Link color="inherit" href="/" to={HOME_PATH} onClick={this.clearItem}>
          <Typography id={NAVIGATION_HOME_LINK_ID}>{t('Home')}</Typography>
        </Link>
        {navEls?.map(({ name, id }) => (
          <Link key={id} to={buildItemPath(id)}>
            <Typography id={buildNavigationLink(id)}>{name}</Typography>
          </Link>
        ))}
        {itemName && (
          <Link key={itemId} to={buildItemPath(itemId)}>
            {itemName}
          </Link>
        )}
      </Breadcrumbs>
    );
  }
}

const mapStateToProps = ({ item }) => ({
  item: item.getIn(['item']),
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

const TranslatedComponent = withTranslation()(ConnectedComponent);
export default withRouter(TranslatedComponent);
