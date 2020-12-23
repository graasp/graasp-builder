import React, { Component } from 'react';
import { Map } from 'immutable';
import _ from 'lodash';
import { withRouter } from 'react-router';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import { Link } from 'react-router-dom';
import { HOME_PATH, buildItemPath } from '../../config/paths';
import { clearItem, getItem } from '../../actions/item';
import {
  buildNavigationLink,
  NAVIGATION_HOME_LINK_ID,
} from '../../config/selectors';
import * as CachedOperation from '../../config/cache';

class Navigation extends Component {
  static propTypes = {
    history: PropTypes.shape({
      push: PropTypes.func.isRequired,
    }).isRequired,
    item: PropTypes.instanceOf(Map).isRequired,
    dispatchClearItem: PropTypes.func.isRequired,
    dispatchGetItem: PropTypes.func.isRequired,
    t: PropTypes.func.isRequired,
    activity: PropTypes.bool.isRequired,
  };

  state = {
    items: [],
  };

  componentDidMount() {
    this.updateItems();
  }

  async componentDidUpdate({ item: prevItem }) {
    const { item, activity } = this.props;
    const { items } = this.state;
    const parents = item.get('parents');
    if (!activity) {
      if (
        !_.isEqual(parents, prevItem.get('parents')) ||
        !items.every(Boolean)
      ) {
        this.updateItems();
      }
    }
  }

  updateItems = async () => {
    const { item, dispatchGetItem } = this.props;
    const parents = item.get('parents');
    const items = await Promise.all(
      parents?.map(async (id) => {
        const completeItem = await CachedOperation.getItem(id);
        if (!completeItem) {
          dispatchGetItem(id);
        }
        return completeItem;
      }),
    );
    // eslint-disable-next-line react/no-did-update-set-state
    this.setState({ items });
  };

  clearItem = () => {
    const { dispatchClearItem } = this.props;
    dispatchClearItem();
  };

  render() {
    const { item, t, activity } = this.props;
    const { items } = this.state;
    const itemName = item.get('name');
    const itemId = item.get('id');

    // wait until all children are available
    if (activity || !items.every(Boolean)) {
      return <CircularProgress color="primary" />;
    }

    return (
      <Breadcrumbs aria-label="breadcrumb">
        <Link color="inherit" href="/" to={HOME_PATH} onClick={this.clearItem}>
          <Typography id={NAVIGATION_HOME_LINK_ID}>{t('Home')}</Typography>
        </Link>
        {items?.map(({ name, id }) => (
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
  activity: Object.values(item.get('activity').toJS()).flat().length,
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
