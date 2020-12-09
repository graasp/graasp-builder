import React, { Component } from 'react';
import List from 'immutable';
import PropTypes from 'prop-types';
import Alert from '@material-ui/lab/Alert';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import CircularProgress from '@material-ui/core/CircularProgress';
import { withRouter } from 'react-router';
import ItemsHeader from './ItemsHeader';
import NewItemButton from './NewItemButton';
import { clearItem, setItem } from '../../actions/item';
import ItemsGrid from './ItemsGrid';
import { ITEM_SCREEN_ERROR_ALERT_ID } from '../../config/selectors';
import { getCachedItem } from '../../config/cache';

class ItemScreen extends Component {
  static propTypes = {
    children: PropTypes.arrayOf(PropTypes.string),
    items: PropTypes.instanceOf(List).isRequired,
    dispatchSetItem: PropTypes.func.isRequired,
    match: PropTypes.shape({
      params: PropTypes.shape({ itemId: PropTypes.string }).isRequired,
    }).isRequired,
    dispatchClearItem: PropTypes.func.isRequired,
    id: PropTypes.string,
    t: PropTypes.func.isRequired,
  };

  static defaultProps = {
    children: [],
    id: null,
  };

  componentDidMount() {
    this.updateItem();
  }

  componentDidUpdate({
    match: {
      params: { itemId: prevId },
    },
  }) {
    const {
      match: {
        params: { itemId },
      },
    } = this.props;

    if (itemId !== prevId) {
      this.updateItem();
    }
  }

  componentWillUnmount() {
    const { dispatchClearItem } = this.props;
    dispatchClearItem();
  }

  updateItem = () => {
    const {
      match: {
        params: { itemId },
      },
      dispatchSetItem,
    } = this.props;

    return dispatchSetItem(itemId);
  };

  render() {
    const { children, items, id: itemId, t } = this.props;

    if (!itemId) {
      return (
        <Alert id={ITEM_SCREEN_ERROR_ALERT_ID} severity="error">
          {t('An error occured.')}
        </Alert>
      );
    }

    // get complete elements from id
    const completeItems = children.map((id) => getCachedItem(items, id));

    // wait until all children are available
    if (!completeItems.every(Boolean)) {
      return <CircularProgress color="primary" />;
    }

    return (
      <>
        <ItemsHeader />
        <NewItemButton />
        <ItemsGrid items={completeItems} />
      </>
    );
  }
}

const mapStateToProps = ({ item }) => ({
  items: item.getIn(['items']),
  children: item.getIn(['item', 'children']),
  id: item.getIn(['item', 'id']),
});

const mapDispatchToProps = {
  dispatchSetItem: setItem,
  dispatchClearItem: clearItem,
};

const ConnectedComponent = connect(
  mapStateToProps,
  mapDispatchToProps,
)(ItemScreen);
const TranslatedComponent = withTranslation()(ConnectedComponent);
export default withRouter(TranslatedComponent);
