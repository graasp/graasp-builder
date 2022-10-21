import { List } from 'immutable';

import Box from '@mui/material/Box';

import { FC } from 'react';

import { BUILDER } from '@graasp/translations';
import { Loader } from '@graasp/ui';

import { useBuilderTranslation } from '../config/i18n';
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
  const { t: translateBuilder } = useBuilderTranslation();
  const { data: sharedItems, isLoading, isError } = hooks.useSharedItems();

  if (isError) {
    return <ErrorAlert id={SHARED_ITEMS_ERROR_ALERT_ID} />;
  }

  if (isLoading) {
    return <Loader />;
  }

  return (
    <Main>
      <Box mx={2}>
        <ItemHeader showNavigation={false} />
        <Items
          id={SHARED_ITEMS_ID}
          title={translateBuilder(BUILDER.SHARED_ITEMS_TITLE)}
          items={List(sharedItems)}
          showCreator
        />
      </Box>
    </Main>
  );
};

export default SharedItems;
