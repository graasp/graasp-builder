import React from 'react';
import { List } from 'immutable';
import { useTranslation } from 'react-i18next';
import ItemHeader from './item/header/ItemHeader';
import ErrorAlert from './common/ErrorAlert';
import Items from './main/Items';
import { hooks } from '../config/queryClient';
import Loader from './common/Loader';
import Main from './main/Main';

const RecycleBinScreen = () => {
  const { t } = useTranslation();
  const { data: items, isLoading, isError } = hooks.useRecycledItems();

  if (isError) {
    return <ErrorAlert />;
  }

  if (isLoading) {
    return <Loader />;
  }

  return (
    <Main>
      <ItemHeader />
      <Items title={t('Deleted Items')} items={List(items)} />
    </Main>
  );
};

export default RecycleBinScreen;
