import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { withRouter } from 'react-router';
import { List } from 'immutable';
import ItemHeader from '../item/header/ItemHeader';
import Items from './Items';
import FileUploader from './FileUploader';
import { HOME_ERROR_ALERT_ID, OWNED_ITEMS_ID } from '../../config/selectors';
import { useOwnItems } from '../../hooks';
import Loader from '../common/Loader';
import ErrorAlert from '../common/ErrorAlert';

const Home = () => {
  const { t } = useTranslation();
  // get own items
  const { data: ownItems, isLoading, isError } = useOwnItems();

  if (isError) {
    return <ErrorAlert id={HOME_ERROR_ALERT_ID} />;
  }

  if (isLoading) {
    return <Loader />;
  }

  return (
    <>
      <FileUploader />
      <ItemHeader />
      <Items id={OWNED_ITEMS_ID} title={t('My Items')} items={List(ownItems)} />
    </>
  );
};

Home.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({ itemId: PropTypes.string }).isRequired,
  }).isRequired,
};

export default withRouter(Home);
