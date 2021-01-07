import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
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
// import * as CachedOperation from '../../config/cache';
import { withCache } from './withCache';

class ItemScreen extends Component {
  static propTypes = {
    dispatchSetItem: PropTypes.func.isRequired,
    match: PropTypes.shape({
      params: PropTypes.shape({ itemId: PropTypes.string }).isRequired,
    }).isRequired,
    dispatchClearItem: PropTypes.func.isRequired,
    t: PropTypes.func.isRequired,
    dispatchGetItem: PropTypes.func.isRequired,
    activity: PropTypes.bool,
    item: PropTypes.shape({
      children: PropTypes.arrayOf(PropTypes.shape({})),
      dirty: PropTypes.bool.isRequired,
    }),
  };

  static defaultProps = {
    activity: true,
    item: null,
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

  shouldComponentUpdate({
    item: nextItem,
    match: {
      params: { itemId: nextId },
    },
  }) {
    const {
      item,
      match: {
        params: { itemId },
      },
    } = this.props;
    // todo: might have to change
    // necessary to avoid render
    return itemId !== nextId || !_.isEqual(item, nextItem);
  }

  async componentDidUpdate({
    match: {
      params: { itemId: prevId },
    },
  }) {
    const {
      match: {
        params: { itemId },
      },
      dispatchSetItem,
      activity,
      dispatchGetItem,
      item,
    } = this.props;

    if (!activity) {
      // case on navigate
      if (itemId !== prevId) {
        dispatchSetItem(itemId);
      }
      // update when dirty or does not exist
      // case create item
      else if (item?.dirty) {
        dispatchGetItem(itemId);
      }
      // case after navigation, update on children
      // else if (items.some(({ dirty }) => dirty)) {
      //   this.updateItems();
      // }
    }
  }

  componentWillUnmount() {
    const { dispatchClearItem } = this.props;
    dispatchClearItem();
  }

  render() {
    const { t, activity, item } = this.props;

    // wait until all children are available
    if (activity) {
      return <CircularProgress color="primary" />;
    }

    if (!item) {
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
        <ItemsGrid items={item.children} />
      </>
    );
  }
}

const mapStateToProps = ({ item }) => ({
  activity: Object.values(item.get('activity').toJS()).flat().length,
  itemId: item.getIn(['item', 'id']),
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
const CacheComponent = withCache(TranslatedComponent);
export default withRouter(CacheComponent);
