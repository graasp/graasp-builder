import React, { Component } from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import Alert from '@material-ui/lab/Alert';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import CircularProgress from '@material-ui/core/CircularProgress';
import { withRouter } from 'react-router';
import ItemsHeader from './ItemsHeader';
import NewItemButton from './NewItemButton';
import { clearItem, getItem, setItem } from '../../actions/item';
import ItemsGrid from './ItemsGrid';
import { ITEM_SCREEN_ERROR_ALERT_ID } from '../../config/selectors';
import * as CachedOperation from '../../config/cache';

class ItemScreen extends Component {
  static propTypes = {
    children: PropTypes.arrayOf(PropTypes.string),
    dispatchSetItem: PropTypes.func.isRequired,
    match: PropTypes.shape({
      params: PropTypes.shape({ itemId: PropTypes.string }).isRequired,
    }).isRequired,
    dispatchClearItem: PropTypes.func.isRequired,
    id: PropTypes.string,
    t: PropTypes.func.isRequired,
    dispatchGetItem: PropTypes.func.isRequired,
    activity: PropTypes.bool,
  };

  static defaultProps = {
    children: [],
    id: null,
    activity: true,
  };

  state = {
    items: [],
  };

  componentDidMount() {
    const {
      match: {
        params: { itemId },
      },
      dispatchSetItem,
    } = this.props;
    dispatchSetItem(itemId);
  }

  componentDidUpdate({
    match: {
      params: { itemId: prevId },
    },
    children: prevChildren,
  }) {
    const {
      match: {
        params: { itemId },
      },
      children,
      dispatchSetItem,
      activity,
    } = this.props;
    const { items } = this.state;

    if (!activity) {
      if (itemId !== prevId) {
        dispatchSetItem(itemId);
      }
      if (!_.isEqual(children, prevChildren) || !items.every(Boolean)) {
        this.updateItems();
      }
    }
  }

  componentWillUnmount() {
    const { dispatchClearItem } = this.props;
    dispatchClearItem();
  }

  updateItems = async () => {
    const { children, dispatchGetItem } = this.props;
    const items = await Promise.all(
      children.map(async (id) => {
        const item = await CachedOperation.getItem(id);
        if (!item) {
          dispatchGetItem(id);
        }
        return item;
      }),
    );
    this.setState({ items });
  };

  render() {
    const { items } = this.state;
    const { id: itemId, t, activity } = this.props;

    // wait until all children are available
    if (activity || !items.every(Boolean)) {
      return <CircularProgress color="primary" />;
    }

    if (!itemId) {
      return (
        <Alert id={ITEM_SCREEN_ERROR_ALERT_ID} severity="error">
          {t('An error occured.')}
        </Alert>
      );
    }

    return (
      <>
        <ItemsHeader />
        <NewItemButton />
        <ItemsGrid items={items} />
      </>
    );
  }
}

const mapStateToProps = ({ item }) => ({
  children: item.getIn(['item', 'children']),
  id: item.getIn(['item', 'id']),
  activity: Object.values(item.get('activity').toJS()).flat().length,
});

const mapDispatchToProps = {
  dispatchGetItem: getItem,
  dispatchSetItem: setItem,
  dispatchClearItem: clearItem,
};

const ConnectedComponent = connect(
  mapStateToProps,
  mapDispatchToProps,
)(ItemScreen);
const TranslatedComponent = withTranslation()(ConnectedComponent);
export default withRouter(TranslatedComponent);
