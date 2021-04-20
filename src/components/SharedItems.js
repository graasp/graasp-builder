import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { List } from 'immutable';
import { SHARED_ITEMS_ID } from '../config/selectors';
import ItemHeader from './item/header/ItemHeader';
import Items from './main/Items';
import { getSharedItems } from '../actions';

const SharedItems = ({ activity, sharedItems, dispatchGetSharedItems }) => {
  const { t } = useTranslation();

  useEffect(() => {
    dispatchGetSharedItems();
  }, [dispatchGetSharedItems]);

  useEffect(() => {
    if (!activity) {
      // update dirty items
      if (sharedItems.some(({ dirty }) => dirty)) {
        dispatchGetSharedItems();
      }
    }
  }, [activity, sharedItems, dispatchGetSharedItems]);

  return (
    <>
      <ItemHeader />
      <Items
        id={SHARED_ITEMS_ID}
        title={t('Items Shared With Me')}
        items={sharedItems}
      />
    </>
  );
};

const mapStateToProps = ({ item }) => ({
  activity: Boolean(Object.values(item.get('activity').toJS()).flat().length),
  sharedItems: item.get('shared'),
});

const mapDispatchToProps = {
  dispatchGetSharedItems: getSharedItems,
};

SharedItems.propTypes = {
  activity: PropTypes.bool.isRequired,
  dispatchGetSharedItems: PropTypes.func.isRequired,
  sharedItems: PropTypes.instanceOf(List).isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(SharedItems);
