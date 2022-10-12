import { List } from 'immutable';

import { FC } from 'react';
import { useTranslation } from 'react-i18next';

import { Loader } from '@graasp/ui';

import { hooks } from '../config/queryClient';
import {
  SHARED_ITEMS_ERROR_ALERT_ID,
  SHARED_ITEMS_ID,
} from '../config/selectors';
import ErrorAlert from './common/ErrorAlert';
import ItemHeader from './item/header/ItemHeader';
import Items from './main/Items';
import Main from './main/Main';

const SharedItems: FC = () => {
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
      <ItemHeader showNavigation={false} />
      <Items
        id={SHARED_ITEMS_ID}
        title={t('Shared Items')}
        items={List(sharedItems)}
        showCreator
      />
    </Main>
  );
};

export default SharedItems;
