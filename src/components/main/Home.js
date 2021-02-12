import React, { Component } from 'react';
import { List } from 'immutable';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import { withRouter } from 'react-router';
import ItemsHeader from './ItemsHeader';
import { setItem, getOwnItems } from '../../actions/item';
import Items from './Items';
import FileUploader from './FileUploader';
import { OWNED_ITEMS_ID } from '../../config/selectors';

class Home extends Component {
  static propTypes = {
    dispatchGetOwnItems: PropTypes.func.isRequired,
    match: PropTypes.shape({
      params: PropTypes.shape({ itemId: PropTypes.string }).isRequired,
    }).isRequired,
    activity: PropTypes.bool.isRequired,
    ownItems: PropTypes.instanceOf(List).isRequired,
    t: PropTypes.func.isRequired,
  };

  async componentDidMount() {
    const { dispatchGetOwnItems } = this.props;
    dispatchGetOwnItems();
  }

  async componentDidUpdate() {
    const { dispatchGetOwnItems, activity, ownItems } = this.props;

    if (!activity) {
      // update dirty items
      if (ownItems.some(({ dirty }) => dirty)) {
        dispatchGetOwnItems();
      }
    }
  }

  render() {
    const { ownItems, t } = this.props;

    return (
      <>
        <FileUploader />
        <ItemsHeader />
        <Items id={OWNED_ITEMS_ID} title={t('My Items')} items={ownItems} />
      </>
    );
  }
}

const mapStateToProps = ({ item }) => ({
  activity: Boolean(Object.values(item.get('activity').toJS()).flat().length),
  ownItems: item.get('own'),
});

const mapDispatchToProps = {
  dispatchGetOwnItems: getOwnItems,
  dispatchSetItem: setItem,
};

const ConnectedComponent = connect(mapStateToProps, mapDispatchToProps)(Home);
const TranslatedComponent = withTranslation()(ConnectedComponent);
export default withRouter(TranslatedComponent);
