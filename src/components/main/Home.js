import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import { withRouter } from 'react-router';
import ItemsHeader from './ItemsHeader';
import NewItemButton from './NewItemButton';
import { setItem, getOwnItems, getSharedItems } from '../../actions/item';
import ItemsGrid from './ItemsGrid';

class Home extends Component {
  static propTypes = {
    dispatchGetOwnItems: PropTypes.func.isRequired,
    match: PropTypes.shape({
      params: PropTypes.shape({ itemId: PropTypes.string }).isRequired,
    }).isRequired,
    activity: PropTypes.bool.isRequired,
    ownItems: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
    sharedItems: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
    t: PropTypes.func.isRequired,
    dispatchGetSharedItems: PropTypes.func.isRequired,
  };

  async componentDidMount() {
    const { dispatchGetOwnItems } = this.props;
    dispatchGetOwnItems();
  }

  async componentDidUpdate() {
    const {
      dispatchGetOwnItems,
      dispatchGetSharedItems,
      activity,
      ownItems,
      sharedItems,
    } = this.props;

    if (!activity) {
      // update dirty items
      if (ownItems.some(({ dirty }) => dirty)) {
        dispatchGetOwnItems();
      }
      // update dirty items
      if (sharedItems.some(({ dirty }) => dirty)) {
        dispatchGetSharedItems();
      }
    }
  }

  render() {
    const { ownItems, sharedItems, t } = this.props;

    return (
      <>
        <ItemsHeader />
        <NewItemButton />
        <Typography variant="h4">{t('My Items')}</Typography>
        <ItemsGrid items={ownItems} />
        <Divider style={{ marginTop: 30, marginBottom: 30 }} />
        <Typography variant="h4">{t('Items Shared With Me')}</Typography>
        <ItemsGrid items={sharedItems} />
      </>
    );
  }
}

const mapStateToProps = ({ item }) => ({
  activity: Object.values(item.get('activity').toJS()).flat().length,
  ownItems: item.get('own'),
  sharedItems: item.get('shared'),
});

const mapDispatchToProps = {
  dispatchGetOwnItems: getOwnItems,
  dispatchSetItem: setItem,
  dispatchGetSharedItems: getSharedItems,
};

const ConnectedComponent = connect(mapStateToProps, mapDispatchToProps)(Home);
const TranslatedComponent = withTranslation()(ConnectedComponent);
export default withRouter(TranslatedComponent);
