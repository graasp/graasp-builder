import React from 'react';
import { List } from 'immutable';
import { useTranslation } from 'react-i18next';
import {
  SHARED_ITEMS_ERROR_ALERT_ID,
  SHARED_ITEMS_ID,
} from '../config/selectors';
import ItemHeader from './item/header/ItemHeader';
import ErrorAlert from './common/ErrorAlert';
import Items from './main/Items';
import { hooks } from '../config/queryClient';
import Loader from './common/Loader';
import Main from './main/Main';
import Authorization from './common/Authorization';

const SharedItems = () => {
  const { t } = useTranslation();
  const { data: sharedItems, isLoading, isError } = hooks.useSharedItems();

  if (isError) {
    return <ErrorAlert id={SHARED_ITEMS_ERROR_ALERT_ID} />;
  }

  if (isLoading) {
    return <Loader />;
  }

  return (
    <Main>
      <ItemHeader />
      <Items
        id={SHARED_ITEMS_ID}
        title={t('Items Shared With Me')}
        items={List(sharedItems)}
      />
    </Main>
  );
};

export default Authorization()(SharedItems);
