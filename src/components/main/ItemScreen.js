import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Alert from '@material-ui/lab/Alert';
import { Map } from 'immutable';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import CircularProgress from '@material-ui/core/CircularProgress';
import { withRouter } from 'react-router';
import ItemsHeader from './ItemsHeader';
import {
  clearItem,
  getOwnItems,
  setItem,
  getSharedItems,
} from '../../actions/item';
import Items from './Items';
import { ITEM_SCREEN_ERROR_ALERT_ID } from '../../config/selectors';
import { areItemsEqual } from '../../utils/item';

class ItemScreen extends Component {
  static propTypes = {
    dispatchSetItem: PropTypes.func.isRequired,
    match: PropTypes.shape({
      params: PropTypes.shape({ itemId: PropTypes.string }).isRequired,
    }).isRequired,
    dispatchClearItem: PropTypes.func.isRequired,
    t: PropTypes.func.isRequired,
    activity: PropTypes.bool,
    item: PropTypes.instanceOf(Map),
    dispatchGetSharedItems: PropTypes.func.isRequired,
    dispatchGetOwnItems: PropTypes.func.isRequired,
  };

  static defaultProps = {
    activity: true,
    item: null,
  };

  constructor(props) {
    super(props);
    const {
      match: {
        params: { itemId },
      },
      dispatchSetItem,
    } = props;
    dispatchSetItem(itemId);
  }

  componentDidMount() {
    const { dispatchGetOwnItems, dispatchGetSharedItems } = this.props;
    dispatchGetOwnItems();
    dispatchGetSharedItems();
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
      activity,
    } = this.props;

    // todo: might have to change
    // necessary to avoid render
    return activity || itemId !== nextId || !areItemsEqual(item, nextItem);
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
        dispatchSetItem(itemId);
      }
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

    if (!item || !item.get('id')) {
      return (
        <Alert id={ITEM_SCREEN_ERROR_ALERT_ID} severity="error">
          {t('An error occured.')}
        </Alert>
      );
    }

    return (
      <>
        <ItemsHeader />
        <Items title={item.get('name')} items={item.get('children')} />
      </>
    );
  }
}

const mapStateToProps = ({ item }) => ({
  activity: Boolean(Object.values(item.get('activity').toJS()).flat().length),
  item: item.get('item'),
});

const mapDispatchToProps = {
  dispatchSetItem: setItem,
  dispatchClearItem: clearItem,
  dispatchGetOwnItems: getOwnItems,
  dispatchGetSharedItems: getSharedItems,
};

const ConnectedComponent = connect(
  mapStateToProps,
  mapDispatchToProps,
)(ItemScreen);
const TranslatedComponent = withTranslation()(ConnectedComponent);
export default withRouter(TranslatedComponent);
